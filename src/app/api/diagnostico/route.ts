import { esquemaDiagnostico, paraHoja } from "@/lib/diagnostico";
import { enviarAHoja, hojaConfigurada, json, leerPeticion } from "@/lib/servidor";

/**
 * Registro de la solicitud de diagnóstico en la hoja de Umotion y aviso por correo (su Gmail).
 * La solicitud sigue viajando por WhatsApp; esto es la copia ordenada que alimenta el seguimiento.
 * Defensas: origen propio, JSON, tamaño, límite por IP, trampa antispam, tiempo mínimo y validación.
 * Sin HOJA_WEBHOOK_URL / HOJA_WEBHOOK_SECRETO responde 503 y el WhatsApp funciona igual.
 */
const TIEMPO_MINIMO_MS = 3000;

export async function POST(request: Request) {
  // Primero las defensas (origen, formato, tamaño, límite por IP): así se aplican aunque la hoja no esté conectada.
  const lectura = await leerPeticion(request, { ambito: "diagnostico", maxPorVentana: 6 });
  if ("error" in lectura) return lectura.error;
  if (!hojaConfigurada()) return json({ error: "no-configurado" }, 503);

  const resultado = esquemaDiagnostico.safeParse(lectura.datos);
  if (!resultado.success) return json({ error: "validacion" }, 422);
  const d = resultado.data;

  // Bots: rellenan el campo trampa o envían en menos de 3 s. Se responde "ok" sin hacer nada.
  if (d.web || Date.now() - d.t < TIEMPO_MINIMO_MS) return json({ ok: true }, 202);

  const ok = await enviarAHoja("diagnostico", paraHoja(d));
  return ok ? json({ ok: true, numero: d.numero }, 202) : json({ error: "envio" }, 502);
}

export function GET() {
  return json({ error: "metodo" }, 405);
}
