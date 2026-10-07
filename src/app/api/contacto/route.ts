import { escaparHtml, esquemaContacto } from "@/lib/contacto";
import { enviarAHoja, hojaConfigurada, json, leerPeticion } from "@/lib/servidor";

/**
 * Endpoint del formulario de contacto.
 * Defensas: solo POST + JSON, límite de tamaño, comprobación de origen (CSRF),
 * limitación por IP, trampa antispam, validación estricta y escape al componer el correo.
 * Destino, por orden:
 *  1. La hoja de cálculo del negocio (HOJA_WEBHOOK_URL): lo anota en «Mensajes» y avisa desde su Gmail.
 *  2. Resend (RESEND_API_KEY, CONTACT_TO, CONTACT_FROM): correo directo, sin guardar nada.
 * Sin ninguno de los dos responde 503 y la interfaz ofrece WhatsApp y teléfono.
 */

const TIEMPO_MINIMO_MS = 3000;

export async function POST(request: Request) {
  const lectura = await leerPeticion(request, { ambito: "contacto", maxPorVentana: 5 });
  if ("error" in lectura) return lectura.error;

  const resultado = esquemaContacto.safeParse(lectura.datos);
  if (!resultado.success) return json({ error: "validacion" }, 422);
  const d = resultado.data;

  // Bots: rellenan el campo trampa o envían en menos de 3 s. Respondemos "ok" sin hacer nada.
  if (d.web || Date.now() - d.t < TIEMPO_MINIMO_MS) return json({ ok: true });

  if (hojaConfigurada()) {
    const ok = await enviarAHoja("contacto", {
      nombre: d.nombre,
      email: d.email,
      telefono: d.telefono,
      motivo: d.motivo,
      mensaje: d.mensaje,
    });
    return ok ? json({ ok: true }) : json({ error: "envio" }, 502);
  }

  const clave = process.env.RESEND_API_KEY;
  const para = process.env.CONTACT_TO;
  const de = process.env.CONTACT_FROM;
  if (!clave || !para || !de) return json({ error: "no-configurado" }, 503);

  const html = `
    <h2>Nuevo mensaje desde la web</h2>
    <p><strong>Motivo:</strong> ${escaparHtml(d.motivo)}</p>
    <p><strong>Nombre:</strong> ${escaparHtml(d.nombre)}</p>
    <p><strong>Email:</strong> ${escaparHtml(d.email || "—")}</p>
    <p><strong>Teléfono:</strong> ${escaparHtml(d.telefono || "—")}</p>
    <p><strong>Mensaje:</strong><br>${escaparHtml(d.mensaje).replace(/\n/g, "<br>")}</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: de,
        to: [para],
        reply_to: d.email || undefined,
        subject: `Web · ${d.motivo} · ${d.nombre}`.slice(0, 140),
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return json({ error: "envio" }, 502);
  } catch {
    return json({ error: "envio" }, 502);
  }

  return json({ ok: true });
}

export function GET() {
  return json({ error: "metodo" }, 405);
}
