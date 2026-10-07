import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { faq } from "@/data/faq";
import { pasos } from "@/data/metodo";
import { negocio } from "@/data/negocio";
import { sectores } from "@/data/sectores";
import { familias, servicios } from "@/data/servicios";
import { faqJsonLd, negocioJsonLd, serviciosJsonLd } from "@/lib/seo";

describe("datos del negocio", () => {
  it("los servicios tienen slugs únicos y pertenecen a una familia", () => {
    assert.equal(new Set(servicios.map((s) => s.slug)).size, servicios.length);
    for (const s of servicios) assert.ok(familias.some((f) => f.id === s.familia), s.slug);
  });

  it("no se publican precios: solo el diagnóstico (confirmado por el cliente) es gratis, el resto «a consultar»", () => {
    assert.deepEqual(servicios.filter((s) => s.precio === "gratis").map((s) => s.slug), ["diagnostico-gratuito"]);
    assert.ok(negocio.diagnosticoGratis);
  });

  it("cada sector tiene cuatro ejemplos completos de «cuando → entonces»", () => {
    assert.equal(new Set(sectores.map((s) => s.id)).size, sectores.length);
    for (const s of sectores) {
      assert.equal(s.reglas.length, 4, s.id);
      for (const r of s.reglas) assert.ok(r.cuando.length > 10 && r.entonces.length > 10, r.cuando);
    }
  });

  it("el método tiene cuatro pasos y empieza por el diagnóstico gratuito", () => {
    assert.equal(pasos.length, 4);
    assert.match(pasos[0].titulo, /Diagnóstico gratuito/);
  });

  it("solo los datos de contacto que ha dado el cliente: correo y WhatsApp, sin redes inventadas", () => {
    assert.equal(negocio.email, "umotionzaragoza@gmail.com");
    assert.deepEqual(Object.values(negocio.redes).filter(Boolean), []);
    assert.equal(negocio.whatsapp, "34633275909");
  });
});

describe("datos estructurados", () => {
  it("el negocio es un servicio profesional con zona de servicio y la oferta del diagnóstico a 0 €", () => {
    const n = negocioJsonLd() as Record<string, unknown> & { makesOffer?: { price: string }; openingHoursSpecification: unknown[] };
    assert.equal(n["@type"], "ProfessionalService");
    assert.equal(n.telephone, "+34633275909");
    assert.equal(n.makesOffer?.price, "0");
    assert.equal(n.openingHoursSpecification.length, 6);
    assert.equal(n.email, "umotionzaragoza@gmail.com");
    assert.doesNotThrow(() => JSON.parse(JSON.stringify(n)));
  });

  it("la lista de servicios y las preguntas frecuentes se serializan completas", () => {
    assert.equal((serviciosJsonLd().itemListElement as unknown[]).length, servicios.length);
    assert.equal(faqJsonLd(faq).mainEntity.length, faq.length);
  });
});
