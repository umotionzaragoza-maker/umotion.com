import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estadoAtencion } from "@/lib/horario";

// Septiembre de 2026 en Zaragoza es horario de verano (UTC+2). 28/09/2026 es lunes.
const zgz = (fecha: string, hora: string) => new Date(`${fecha}T${hora}:00+02:00`);

describe("estadoAtencion (lunes a sábado, 9:00–20:00, hora de Zaragoza)", () => {
  it("lunes por la mañana: atendiendo hasta las 20:00", () => {
    const e = estadoAtencion(zgz("2026-09-28", "10:00"));
    assert.equal(e.atendiendo, true);
    assert.equal(e.corto, "Atendemos · hasta 20:00");
  });

  it("horario continuo: a mediodía también se atiende", () => {
    assert.equal(estadoAtencion(zgz("2026-09-28", "15:00")).atendiendo, true);
  });

  it("antes de las 9:00: vuelve hoy a las 9:00", () => {
    assert.equal(estadoAtencion(zgz("2026-09-28", "07:30")).corto, "Volvemos a las 9:00");
  });

  it("viernes por la noche: vuelve mañana sábado", () => {
    assert.equal(estadoAtencion(zgz("2026-09-25", "20:30")).corto, "Volvemos mañana a las 9:00");
  });

  it("sábado por la noche: vuelve el lunes (el domingo no se atiende)", () => {
    const e = estadoAtencion(zgz("2026-09-26", "21:00"));
    assert.equal(e.corto, "Volvemos el lunes a las 9:00");
    assert.match(e.largo, /Escríbenos/);
  });

  it("domingo: vuelve mañana lunes", () => {
    assert.equal(estadoAtencion(zgz("2026-09-27", "12:00")).corto, "Volvemos mañana a las 9:00");
  });

  it("respeta el horario de invierno (UTC+1)", () => {
    // 14/12/2026 lunes 19:30 en Zaragoza = 18:30 UTC
    assert.equal(estadoAtencion(new Date("2026-12-14T18:30:00Z")).atendiendo, true);
    // 20:30 en Zaragoza = 19:30 UTC
    assert.equal(estadoAtencion(new Date("2026-12-14T19:30:00Z")).atendiendo, false);
  });

  it("no depende de la zona horaria del visitante", () => {
    // Lunes 10:00 en Zaragoza, expresado desde Nueva York.
    assert.equal(estadoAtencion(new Date("2026-09-28T04:00:00-04:00")).corto, "Atendemos · hasta 20:00");
  });
});
