import assert from "node:assert/strict";
import { test } from "node:test";
import { MOTIVOS, escaparHtml, esquemaContacto } from "@/lib/contacto";

const base = {
  nombre: "Ana Pérez",
  email: "ana@ejemplo.es",
  telefono: "",
  motivo: MOTIVOS[0],
  mensaje: "Quería saber si se pueden automatizar las reservas de mi bar.",
  privacidad: true,
  web: "",
  t: 1_700_000_000_000,
};

const falla = (datos: object, campo: string) => {
  const r = esquemaContacto.safeParse(datos);
  assert.equal(r.success, false);
  if (!r.success) assert.ok(r.error.issues.some((i) => i.path[0] === campo), `se esperaba un error en «${campo}»`);
};

test("contacto: acepta un mensaje con email o con teléfono", () => {
  assert.equal(esquemaContacto.safeParse(base).success, true);
  assert.equal(esquemaContacto.safeParse({ ...base, email: "", telefono: "+34 633 27 59 09" }).success, true);
  assert.equal(esquemaContacto.safeParse({ ...base, email: "", telefono: "976-40-59-39" }).success, true);
});

test("contacto: exige al menos una vía de respuesta", () => {
  falla({ ...base, email: "", telefono: "" }, "email");
});

test("contacto: con el formulario vacío señala todos los campos a la vez", () => {
  const r = esquemaContacto.safeParse({ ...base, nombre: "", email: "", telefono: "", mensaje: "", privacidad: false });
  assert.equal(r.success, false);
  if (!r.success) {
    const campos = new Set(r.error.issues.map((i) => String(i.path[0])));
    for (const c of ["nombre", "email", "mensaje", "privacidad"]) assert.ok(campos.has(c), `falta el error de «${c}»`);
  }
});

test("contacto: limpia espacios y caracteres de control", () => {
  const r = esquemaContacto.safeParse({ ...base, nombre: "  Ana\u0007 ", email: "  ana@ejemplo.es ", mensaje: "\u0000 Hola, ¿tenéis alitas hoy? " });
  assert.equal(r.success, true);
  if (r.success) {
    assert.equal(r.data.nombre, "Ana");
    assert.equal(r.data.email, "ana@ejemplo.es");
    assert.equal(r.data.mensaje, "Hola, ¿tenéis alitas hoy?");
  }
});

test("contacto: rechaza campos inválidos", () => {
  falla({ ...base, nombre: "A" }, "nombre");
  falla({ ...base, nombre: " \u0007 A " }, "nombre");
  falla({ ...base, nombre: "x".repeat(81) }, "nombre");
  falla({ ...base, email: "ana@" }, "email");
  falla({ ...base, email: "x".repeat(116) + "@a.es" }, "email");
  falla({ ...base, telefono: "llámame" }, "telefono");
  falla({ ...base, telefono: "123" }, "telefono");
  falla({ ...base, motivo: "Quiero vender algo" }, "motivo");
  falla({ ...base, mensaje: "Hola" }, "mensaje");
  falla({ ...base, mensaje: "x".repeat(2001) }, "mensaje");
  falla({ ...base, privacidad: false }, "privacidad");
  falla({ ...base, t: -5 }, "t");
  falla({ ...base, t: 1.5 }, "t");
  falla({ ...base, web: "x".repeat(201) }, "web");
});

test("contacto: rechaza tipos inesperados", () => {
  falla({ ...base, nombre: 42 }, "nombre");
  falla({ ...base, privacidad: "on" }, "privacidad");
  falla({ ...base, t: "1700000000000" }, "t");
  assert.equal(esquemaContacto.safeParse(null).success, false);
  assert.equal(esquemaContacto.safeParse("hola").success, false);
});

test("contacto: el campo trampa es opcional", () => {
  const { web: _web, ...sinTrampa } = base;
  const r = esquemaContacto.safeParse(sinTrampa);
  assert.equal(r.success, true);
  if (r.success) assert.equal(r.data.web, "");
});

test("contacto: el escape impide inyectar HTML en el correo", () => {
  assert.equal(escaparHtml(`<img src=x onerror="a('b')">&`), "&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
});
