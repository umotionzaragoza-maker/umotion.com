/**
 * Utilidades de los endpoints (/api/contacto, /api/diagnostico): respuesta JSON, defensa común y envío a
 * la hoja de cálculo del negocio (Google Apps Script, ver integraciones/hoja-de-solicitudes/).
 */

export const json = (cuerpo: object, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const VENTANA_MS = 10 * 60 * 1000;
const registros = new Map<string, Map<string, number[]>>();

// Limitación en memoria: suficiente para una instancia. Con varias, usar un almacén compartido
// (Upstash Redis, Vercel KV) con la misma lógica.
function limitado(ambito: string, ip: string, max: number) {
  const intentos = registros.get(ambito) ?? new Map<string, number[]>();
  registros.set(ambito, intentos);
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  if (intentos.size > 5000) for (const [k, v] of intentos) if (v.every((t) => ahora - t > VENTANA_MS)) intentos.delete(k);
  return recientes.length > max;
}

/**
 * Defensas comunes: origen propio (CSRF), JSON, límite por IP y tamaño.
 * Devuelve el cuerpo ya parseado o la respuesta de error que hay que devolver.
 */
export async function leerPeticion(
  request: Request,
  { ambito, maxPorVentana, tamanoMax = 10_000 }: { ambito: string; maxPorVentana: number; tamanoMax?: number },
): Promise<{ datos: unknown } | { error: Response }> {
  const origen = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origen || !host || new URL(origen).host !== host) return { error: json({ error: "origen" }, 403) };
  if (!request.headers.get("content-type")?.includes("application/json")) return { error: json({ error: "formato" }, 415) };

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (limitado(ambito, ip, maxPorVentana)) return { error: json({ error: "demasiados" }, 429) };

  const crudo = await request.text();
  if (crudo.length > tamanoMax) return { error: json({ error: "tamano" }, 413) };
  try {
    return { datos: JSON.parse(crudo) };
  } catch {
    return { error: json({ error: "formato" }, 400) };
  }
}

/** ¿Está conectada la hoja de cálculo del negocio? */
export const hojaConfigurada = () => !!process.env.HOJA_WEBHOOK_URL && !!process.env.HOJA_WEBHOOK_SECRETO;

/**
 * Envía una solicitud de diagnóstico o un mensaje a la hoja del negocio. El script de la hoja lo anota y manda
 * el aviso por correo desde la propia cuenta de Gmail del negocio.
 * Google responde con una redirección a la respuesta del script: se sigue y se lee su JSON.
 */
export async function enviarAHoja(tipo: "diagnostico" | "contacto", datos: object): Promise<boolean> {
  const url = process.env.HOJA_WEBHOOK_URL;
  const secreto = process.env.HOJA_WEBHOOK_SECRETO;
  if (!url || !secreto) return false;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secreto, tipo, datos }),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) return false;
    const respuesta = (await r.json().catch(() => null)) as { ok?: boolean } | null;
    return respuesta?.ok === true;
  } catch {
    return false;
  }
}
