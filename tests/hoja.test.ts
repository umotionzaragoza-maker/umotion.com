import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, it } from "node:test";
import vm from "node:vm";
import { esquemaDiagnostico, mensajeDiagnostico, nuevoNumeroSolicitud, paraHoja, type SolicitudDiagnostico } from "@/lib/diagnostico";

/*
 * El script de la hoja (integraciones/hoja-de-solicitudes/Codigo.gs) se ejecuta aquí contra una
 * imitación mínima de Google Sheets y Gmail: mismas llamadas, datos en memoria.
 */

type Celda = unknown;

// Cualquier método desconocido (formatos, anchos, reglas…) devuelve el mismo objeto: permite encadenar.
const cadena = (): unknown =>
  new Proxy(function () {}, { get: (_, k) => (k === "build" ? () => ({}) : () => cadena()), apply: () => cadena() });

function conResto<T extends object>(obj: T): T {
  return new Proxy(obj, { get: (o, k) => (k in o ? (o as Record<PropertyKey, unknown>)[k] : () => cadena()) });
}

class Hoja {
  filas: Celda[][] = [];
  nombre: string;
  constructor(nombre: string) {
    this.nombre = nombre;
  }
  getName() { return this.nombre; }
  getLastRow() {
    for (let i = this.filas.length; i > 0; i--) if (this.filas[i - 1]?.some((v) => v !== "" && v !== undefined && v !== null)) return i;
    return 0;
  }
  appendRow(v: Celda[]) { this.filas[this.getLastRow()] = [...v]; }
  clear() { this.filas = []; }
  valor(f: number, c: number) { return this.filas[f - 1]?.[c - 1] ?? ""; }
  poner(f: number, c: number, v: Celda) { (this.filas[f - 1] ??= [])[c - 1] = v; }
  getRange(a: number | string, b?: number, c?: number, d?: number) {
    let [f, col, nf, nc] = [0, 0, 1, 1];
    if (typeof a === "string") {
      const m = /^([A-Z]+)(\d+)?(?::([A-Z]+)(\d+)?)?$/.exec(a)!;
      const letra = (s: string) => s.split("").reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
      f = Number(m[2] ?? 1); col = letra(m[1]!);
      nc = m[3] ? letra(m[3]) - col + 1 : 1;
      nf = m[3] ? (m[4] ? Number(m[4]) - f + 1 : 1000) : 1;
    } else [f, col, nf, nc] = [a, b!, c ?? 1, d ?? 1];
    const hoja = this;
    const rango = conResto({
      getSheet: () => hoja,
      getRow: () => f, getColumn: () => col, getLastRow: () => f + nf - 1, getLastColumn: () => col + nc - 1,
      getValues: () => Array.from({ length: nf }, (_, i) => Array.from({ length: nc }, (_, j) => hoja.valor(f + i, col + j))),
      getValue: () => hoja.valor(f, col),
      setValues: (v: Celda[][]) => { v.forEach((fila, i) => fila.forEach((x, j) => hoja.poner(f + i, col + j, x))); return rango; },
      setValue: (x: Celda) => { hoja.poner(f, col, x); return rango; },
      setFormula: (x: string) => { hoja.poner(f, col, x); return rango; },
      setFormulas: (v: string[][]) => { v.forEach((fila, i) => fila.forEach((x, j) => hoja.poner(f + i, col + j, x))); return rango; },
      clearContent: () => { for (let i = 0; i < nf; i++) for (let j = 0; j < nc; j++) hoja.poner(f + i, col + j, ""); return rango; },
    });
    return rango;
  }
}

let hojas: Map<string, Hoja>;
let propiedades: Map<string, string>;
let correos: Record<string, string>[];
let alertas: string[];
let gs: Record<string, (...a: unknown[]) => unknown>;

beforeEach(() => {
  hojas = new Map();
  propiedades = new Map();
  correos = [];
  alertas = [];
  const libro = conResto({
    getSheetByName: (n: string) => hojas.get(n) ?? null,
    insertSheet: (n: string) => { const h = conResto(new Hoja(n)); hojas.set(n, h); return h; },
    getUrl: () => "https://docs.google.com/spreadsheets/d/prueba",
  });
  const contexto = vm.createContext({
    SpreadsheetApp: conResto({
      getActiveSpreadsheet: () => libro,
      getUi: () => conResto({ alert: (t: string) => alertas.push(t), createMenu: () => cadena() }),
      newDataValidation: () => cadena(),
      newConditionalFormatRule: () => cadena(),
    }),
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k: string) => propiedades.get(k) ?? null, setProperty: (k: string, v: string) => propiedades.set(k, v) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    MailApp: { sendEmail: (o: Record<string, string>) => correos.push(o) },
    Session: { getEffectiveUser: () => ({ getEmail: () => "umotion@gmail.com" }) },
    ContentService: {
      createTextOutput: (s: string) => ({ contenido: s, setMimeType() { return this; } }),
      MimeType: { JSON: "json" },
    },
    Utilities: { getUuid: () => "1234-5678-abcd" },
  });
  vm.runInContext(readFileSync(join(import.meta.dirname, "..", "integraciones", "hoja-de-solicitudes", "Codigo.gs"), "utf8"), contexto);
  gs = contexto as unknown as typeof gs;
  gs.prepararHojas!();
});

const hoja = (n: string) => hojas.get(n)!;
const numero = "D-260930-4F7K";

const formulario = (extra: Partial<Record<keyof SolicitudDiagnostico, unknown>> = {}) => ({
  numero,
  nombre: "Lucía",
  negocio: "Bar La Plaza",
  sector: "Hostelería",
  tareas: ["Pedidos, reservas o citas", "Facturas y papeleo"],
  detalle: "Apunto a mano las reservas de WhatsApp.",
  modalidad: "En mi negocio (Zaragoza)",
  franja: "Por la tarde",
  telefono: "",
  privacidad: true,
  web: "",
  t: 1_700_000_000_000,
  ...extra,
});

const solicitud = (extra = {}) => {
  const r = esquemaDiagnostico.safeParse(formulario(extra));
  assert.ok(r.success, "la solicitud de prueba debería ser válida");
  return r.data;
};

const post = (cuerpo: object) =>
  JSON.parse((gs.doPost!({ postData: { contents: JSON.stringify(cuerpo) } }) as { contenido: string }).contenido) as { ok: boolean; error?: string };

describe("solicitud de diagnóstico (web)", () => {
  it("el número lleva la fecha de Zaragoza y caracteres fáciles de dictar", () => {
    // 23:30 UTC del 29/09 ya es 30/09 en Zaragoza.
    const n = nuevoNumeroSolicitud(new Date("2026-09-29T23:30:00Z"), () => 0.5);
    assert.match(n, /^D-260930-[2-9A-HJ-NP-Z]{4}$/);
    assert.equal(esquemaDiagnostico.safeParse(formulario({ numero: "D-260930-0O1I" })).success, false);
  });

  it("solo el nombre y el consentimiento son obligatorios", () => {
    assert.ok(esquemaDiagnostico.safeParse(formulario({ negocio: "", tareas: [], detalle: "" })).success);
    const r = esquemaDiagnostico.safeParse(formulario({ nombre: "", privacidad: false }));
    assert.equal(r.success, false);
    if (!r.success) {
      const campos = new Set(r.error.issues.map((i) => String(i.path[0])));
      assert.ok(campos.has("nombre") && campos.has("privacidad"));
    }
  });

  it("rechaza tipos de negocio y tareas que no están en la lista", () => {
    assert.equal(esquemaDiagnostico.safeParse(formulario({ sector: "Banca" })).success, false);
    assert.equal(esquemaDiagnostico.safeParse(formulario({ tareas: ["Hackear"] })).success, false);
  });

  it("el mensaje de WhatsApp lleva todo lo marcado, sin líneas vacías de más", () => {
    const m = mensajeDiagnostico({ ...solicitud(), numero });
    assert.match(m, /^Hola, Umotion\. Quiero pedir el diagnóstico gratuito/);
    assert.match(m, /Negocio: Bar La Plaza \(Hostelería\)/);
    assert.match(m, /Lo que más tiempo me quita: Pedidos, reservas o citas, Facturas y papeleo/);
    assert.match(m, /Prefiero: en mi negocio \(zaragoza\) · por la tarde/);
    assert.ok(m.endsWith(`(Solicitud ${numero}, enviada desde la web)`));
    assert.ok(!/\n\n\n/.test(m));
    const minimo = mensajeDiagnostico(solicitud({ negocio: "", tareas: [], detalle: "" }));
    assert.match(minimo, /Tipo de negocio: Hostelería/);
    assert.ok(!minimo.includes("Detalle:"));
  });
});

describe("hoja de solicitudes (Apps Script)", () => {
  it("prepara las hojas, el resumen y una clave secreta", () => {
    for (const n of ["Solicitudes", "Mensajes", "Resumen"]) assert.ok(hojas.has(n), n);
    assert.equal(hoja("Solicitudes").valor(1, 11), "Estado");
    assert.match(String(hoja("Resumen").valor(2, 2)), /^=COUNTA/);
    assert.match(propiedades.get("SECRETO") ?? "", /^[0-9a-z]+$/);
  });

  it("rechaza peticiones sin la clave secreta o de tipo desconocido", () => {
    assert.deepEqual(post({ secreto: "mala", tipo: "diagnostico", datos: paraHoja(solicitud()) }), { ok: false, error: "secreto" });
    assert.deepEqual(post({ secreto: propiedades.get("SECRETO"), tipo: "pedido", datos: {} }), { ok: false, error: "tipo" });
    assert.equal(hoja("Solicitudes").getLastRow(), 1);
    assert.equal(correos.length, 0);
  });

  it("anota la solicitud como Nueva, avisa por correo y no duplica reintentos", () => {
    const secreto = propiedades.get("SECRETO");
    assert.deepEqual(post({ secreto, tipo: "diagnostico", datos: paraHoja(solicitud()) }), { ok: true });
    assert.deepEqual(post({ secreto, tipo: "diagnostico", datos: paraHoja(solicitud()) }), { ok: true });
    const s = hoja("Solicitudes");
    assert.equal(s.getLastRow(), 2);
    assert.equal(s.valor(2, 2), numero);
    assert.equal(s.valor(2, 3), "Lucía");
    assert.equal(s.valor(2, 6), "Pedidos, reservas o citas, Facturas y papeleo");
    assert.equal(s.valor(2, 11), "Nueva");
    assert.equal(correos.length, 1);
    assert.equal(correos[0]!.to, "umotion@gmail.com");
    assert.match(correos[0]!.subject!, new RegExp(numero));
    assert.match(correos[0]!.htmlBody!, /Bar La Plaza/);
  });

  it("guarda como texto lo que empieza por = + - @ (sin fórmulas inyectadas) y escapa el correo", () => {
    const d = { ...paraHoja(solicitud()), nombre: '=HYPERLINK("http://x","clic")', detalle: "<script>alert(1)</script>" };
    post({ secreto: propiedades.get("SECRETO"), tipo: "diagnostico", datos: d });
    assert.equal(hoja("Solicitudes").valor(2, 3), `'=HYPERLINK("http://x","clic")`);
    assert.ok(!correos[0]!.htmlBody!.includes("<script>"));
  });

  it("anota los mensajes de contacto y responde al cliente con su email", () => {
    post({
      secreto: propiedades.get("SECRETO"),
      tipo: "contacto",
      datos: { nombre: "Ana", email: "ana@ejemplo.es", telefono: "", motivo: "Otro", mensaje: "Hola\nqué tal" },
    });
    assert.equal(hoja("Mensajes").valor(2, 2), "Ana");
    assert.equal(correos[0]!.replyTo, "ana@ejemplo.es");
  });
});

describe("POST /api/diagnostico", () => {
  const peticion = (cuerpo: object, origen: string | null = "http://localhost:5201") =>
    new Request("http://localhost:5201/api/diagnostico", {
      method: "POST",
      headers: { "content-type": "application/json", host: "localhost:5201", ...(origen ? { origin: origen } : {}) },
      body: JSON.stringify(cuerpo),
    });

  it("sin hoja responde 503; con otro origen, 403; valida; descarta bots; y reenvía los datos limpios", async () => {
    const { POST } = await import("@/app/api/diagnostico/route");
    delete process.env.HOJA_WEBHOOK_URL;
    assert.equal((await POST(peticion(formulario()))).status, 503);

    process.env.HOJA_WEBHOOK_URL = "https://script.google.com/macros/s/prueba/exec";
    process.env.HOJA_WEBHOOK_SECRETO = "secreto";
    assert.equal((await POST(peticion(formulario(), "https://otra.web"))).status, 403);
    assert.equal((await POST(peticion(formulario({ sector: "Banca" })))).status, 422);

    const original = globalThis.fetch;
    const enviados: { secreto: string; tipo: string; datos: Record<string, unknown> }[] = [];
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      enviados.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as typeof fetch;
    try {
      // Bot: campo trampa relleno → responde bien pero no envía nada.
      assert.equal((await POST(peticion(formulario({ web: "spam" })))).status, 202);
      assert.equal(enviados.length, 0);

      const r = await POST(peticion(formulario()));
      assert.equal(r.status, 202);
      assert.equal(enviados.length, 1);
      assert.equal(enviados[0]!.secreto, "secreto");
      assert.equal(enviados[0]!.tipo, "diagnostico");
      assert.equal(enviados[0]!.datos.tareas, "Pedidos, reservas o citas, Facturas y papeleo");
      assert.ok(!("privacidad" in enviados[0]!.datos) && !("web" in enviados[0]!.datos));
    } finally {
      globalThis.fetch = original;
      delete process.env.HOJA_WEBHOOK_URL;
      delete process.env.HOJA_WEBHOOK_SECRETO;
    }
  });
});
