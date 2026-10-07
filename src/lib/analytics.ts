"use client";

import { track as trackVercel } from "@vercel/analytics";
import { consentimiento } from "./consent";

/**
 * Capa de medición. Todos los eventos pasan por aquí (docs/ANALITICA.md):
 * - GA4 / GTM: solo si el usuario ha aceptado la analítica. Nombres de evento estándar de GA4
 *   (generate_lead, form_start) para que GTM los reenvíe sin transformar.
 * - Vercel Web Analytics: sin cookies ni identificadores, así que cuenta a todos los
 *   visitantes. Solo recibe las conversiones, con datos agregados (nunca nombres ni notas).
 */
export type Evento =
  | "form_start"
  | "generate_lead"
  | "click_llamar"
  | "click_whatsapp"
  | "click_email"
  | "contacto_enviado"
  | "contacto_error"
  | "cta_click";

type DataLayer = Array<Record<string, unknown>>;
declare global {
  interface Window {
    dataLayer?: DataLayer;
  }
}

/** Conversiones que se cuentan también en Vercel, con el nombre que se verá en su panel. */
const CONVERSIONES: Partial<Record<Evento, string>> = {
  generate_lead: "Diagnóstico solicitado",
  click_whatsapp: "Clic en WhatsApp",
  click_llamar: "Clic en llamar",
  click_email: "Clic en email",
  contacto_enviado: "Mensaje de contacto enviado",
};

/** Solo datos agregados y planos: origen del clic, tipo de negocio y número de tareas marcadas. Nunca nombres ni textos. */
function datosVercel(params: Record<string, unknown>) {
  const datos: Record<string, string | number> = {};
  if (typeof params.origen === "string") datos.origen = params.origen;
  if (typeof params.sector === "string") datos.sector = params.sector;
  if (typeof params.modalidad === "string") datos.modalidad = params.modalidad;
  if (typeof params.tareas === "number") datos.tareas = params.tareas;
  if (typeof params.motivo === "string") datos.motivo = params.motivo;
  return datos;
}

export function track(evento: Evento, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const nombre = CONVERSIONES[evento];
  // Fuera de Vercel (en local) window.va no existe y esto no hace nada.
  if (nombre) trackVercel(nombre, datosVercel(params));
  const c = consentimiento.obtener();
  if (!c?.analitica) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: evento, ...params });
}
