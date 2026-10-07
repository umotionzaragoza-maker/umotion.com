// Solicitud del diagnóstico gratuito. Sin "use client": la usan el formulario, la API y las pruebas.
import * as z from "zod/mini";
import { negocio } from "@/data/negocio";

/**
 * Número de solicitud legible, el mismo en el mensaje de WhatsApp, en el correo y en la hoja,
 * para casar el chat con la fila: D-260930-4F7K (fecha en hora de Madrid + 4 caracteres).
 * Sin 0/O ni 1/I para que se pueda dictar por teléfono sin errores.
 */
const ALFABETO = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const PATRON_NUMERO = /^D-\d{6}-[2-9A-HJ-NP-Z]{4}$/;

export function nuevoNumeroSolicitud(fecha = new Date(), aleatorio: () => number = Math.random) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "2-digit", month: "2-digit", day: "2-digit" }).formatToParts(fecha);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "00";
  const sufijo = Array.from({ length: 4 }, () => ALFABETO[Math.floor(aleatorio() * ALFABETO.length)]).join("");
  return `D-${g("year")}${g("month")}${g("day")}-${sufijo}`;
}

export const SECTORES = ["Hostelería", "Comercio", "Profesional o autónomo", "Pyme con equipo", "Otro"] as const;
export const TAREAS = [
  "Pedidos, reservas o citas",
  "Facturas y papeleo",
  "Correo y mensajes de clientes",
  "Informes y cifras del negocio",
  "Pasar datos de un programa a otro",
  "Tener web o tienda online",
  "Conseguir más clientes",
  "Aún no lo sé",
] as const;
export const MODALIDADES = ["En mi negocio (Zaragoza)", "Por videollamada", "Me da igual"] as const;
export const FRANJAS = ["Por la mañana", "Por la tarde", "Me da igual"] as const;

const limpiar = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
const texto = (min: number, max: number) => z.string().check(z.overwrite(limpiar), z.minLength(min), z.maxLength(max));

export const esquemaDiagnostico = z.object({
  numero: z.string().check(z.regex(PATRON_NUMERO)),
  nombre: texto(2, 80),
  negocio: texto(0, 120),
  sector: z.enum(SECTORES),
  tareas: z.array(z.enum(TAREAS)).check(z.maxLength(TAREAS.length)),
  detalle: texto(0, 1000),
  modalidad: z.enum(MODALIDADES),
  franja: z.enum(FRANJAS),
  telefono: z.pipe(z.string().check(z.trim(), z.maxLength(20)), z.union([z.literal(""), z.string().check(z.regex(/^[+\d][\d\s-]{7,18}$/))])),
  privacidad: z.literal(true),
  // Antispam: campo trampa invisible y tiempo mínimo de rellenado (se comprueban en el servidor).
  web: z._default(z.optional(z.string().check(z.maxLength(200))), ""),
  t: z.int().check(z.positive()),
});

export type SolicitudDiagnostico = z.infer<typeof esquemaDiagnostico>;

/** Datos que se guardan en la hoja: sin los campos técnicos del formulario. */
export const paraHoja = (d: SolicitudDiagnostico) => ({
  numero: d.numero,
  nombre: d.nombre,
  negocio: d.negocio,
  sector: d.sector,
  tareas: d.tareas.join(", "),
  detalle: d.detalle,
  modalidad: d.modalidad,
  franja: d.franja,
  telefono: d.telefono,
});

/** Mensaje de WhatsApp ya redactado: el cliente solo tiene que pulsar enviar. */
export function mensajeDiagnostico(d: Pick<SolicitudDiagnostico, "nombre" | "negocio" | "sector" | "tareas" | "detalle" | "modalidad" | "franja" | "telefono"> & { numero?: string }) {
  return [
    `Hola, ${negocio.nombre}. Quiero pedir el diagnóstico gratuito para mi negocio.`,
    "",
    `Nombre: ${d.nombre.trim()}`,
    d.negocio.trim() ? `Negocio: ${d.negocio.trim()} (${d.sector})` : `Tipo de negocio: ${d.sector}`,
    d.tareas.length ? `Lo que más tiempo me quita: ${d.tareas.join(", ")}` : null,
    d.detalle.trim() ? `Detalle: ${d.detalle.trim()}` : null,
    `Prefiero: ${d.modalidad.toLowerCase()} · ${d.franja.toLowerCase()}`,
    d.telefono.trim() ? `Teléfono: ${d.telefono.trim()}` : null,
    "",
    d.numero ? `(Solicitud ${d.numero}, enviada desde la web)` : "(Enviada desde la web)",
  ]
    .filter((linea) => linea !== null)
    .join("\n");
}
