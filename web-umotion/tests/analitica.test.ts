import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

// Navegador simulado: almacenamiento, capa de datos de GTM y la cola de Vercel (window.va).
const almacen = new Map<string, string>();
const enviadosVercel: Array<{ name: string; data?: Record<string, unknown> }> = [];
const w = {
  localStorage: {
    getItem: (k: string) => almacen.get(k) ?? null,
    setItem: (k: string, v: string) => void almacen.set(k, v),
    removeItem: (k: string) => void almacen.delete(k),
  },
  dataLayer: [] as Array<Record<string, unknown>>,
  va: (_tipo: string, evento: { name: string; data?: Record<string, unknown> }) => void enviadosVercel.push(evento),
  dispatchEvent: () => true,
  addEventListener: () => {},
};
Object.assign(globalThis, { window: w });

const { track } = await import("@/lib/analytics");
const { consentimiento } = await import("@/lib/consent");

const solicitud = { origen: "diagnostico", sector: "Hostelería", modalidad: "Por videollamada", tareas: 2 };

describe("medición", () => {
  beforeEach(() => {
    enviadosVercel.length = 0;
    w.dataLayer.length = 0;
  });

  it("sin consentimiento: Vercel cuenta la conversión y GA4 no recibe nada", () => {
    track("generate_lead", solicitud);
    assert.equal(w.dataLayer.length, 0);
    assert.deepEqual(enviadosVercel, [
      { name: "Diagnóstico solicitado", data: { origen: "diagnostico", sector: "Hostelería", modalidad: "Por videollamada", tareas: 2 }, options: undefined },
    ]);
  });

  it("a Vercel solo llegan conversiones, con datos agregados y nunca textos del cliente", () => {
    track("form_start", { origen: "diagnostico" });
    track("cta_click", { cta: "diagnostico", origen: "heroe" });
    track("click_whatsapp", { origen: "barra-movil", nombre: "Lucía Pérez", detalle: "Tengo un bar en Delicias" });
    assert.equal(enviadosVercel.length, 1);
    assert.equal(enviadosVercel[0]?.name, "Clic en WhatsApp");
    assert.deepEqual(enviadosVercel[0]?.data, { origen: "barra-movil" });
    const todo = JSON.stringify(enviadosVercel);
    for (const prohibido of ["Lucía", "Delicias"]) assert.ok(!todo.includes(prohibido), prohibido);
  });

  it("con consentimiento, GA4 recibe el evento completo además de Vercel", () => {
    consentimiento.guardar(true, false);
    track("generate_lead", solicitud);
    assert.equal(enviadosVercel.length, 1);
    const evento = w.dataLayer.find((e) => e.event === "generate_lead");
    assert.ok(evento, "falta el evento en la capa de datos");
    assert.equal(evento.sector, "Hostelería");
  });
});
