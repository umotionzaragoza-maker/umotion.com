"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icono } from "@/components/ui/Icono";
import { sectores, type SectorId } from "@/data/sectores";
import { track } from "@/lib/analytics";

/**
 * «Elige tu negocio»: el visitante se reconoce y ve una automatización concreta como esquema
 * cuando → Umotion → entonces. Sustituye a los capítulos Mundos, Oficio y AntesDespues.
 */
export function Configurador() {
  const [sectorId, setSectorId] = useState<SectorId>("hosteleria");
  const [regla, setRegla] = useState(0);
  const base = useId();
  const sector = sectores.find((s) => s.id === sectorId) ?? sectores[0]!;
  const actual = sector.reglas[regla] ?? sector.reglas[0]!;

  const elegirSector = (id: SectorId) => {
    setSectorId(id);
    setRegla(0);
    track("cta_click", { cta: "configurador_sector", sector: id });
  };

  const alTeclear = (e: React.KeyboardEvent, i: number) => {
    const n = sectores.length;
    const destino = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : null;
    if (destino === null) return;
    e.preventDefault();
    elegirSector(sectores[destino]!.id);
    document.getElementById(`${base}-tab-${destino}`)?.focus();
  };

  return (
    <section id="ejemplos" data-tema="claro" className="bg-papel" aria-labelledby="titulo-configurador">
      <div className="marco seccion">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-etiqueta text-amarillo-hondo">02 · Automatización en tu negocio</p>
            <h2 id="titulo-configurador" className="t-display mt-5 max-w-[16ch]">
              Elige tu negocio. <span className="text-niebla">Mira lo que dejaría de ser tarea tuya.</span>
            </h2>
          </div>
          <p className="max-w-md text-gris lg:col-span-5 lg:justify-self-end">
            Son ejemplos de automatizaciones habituales, no casos de clientes. En el diagnóstico buscamos las de tu negocio.
          </p>
        </div>

        <div role="tablist" aria-label="Tipo de negocio" className="mt-12 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {sectores.map((s, i) => {
            const activo = s.id === sectorId;
            return (
              <button
                key={s.id}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={activo}
                aria-controls={`${base}-panel`}
                tabIndex={activo ? 0 : -1}
                onClick={() => elegirSector(s.id)}
                onKeyDown={(e) => alTeclear(e, i)}
                className={`shrink-0 rounded-full px-5 py-3 text-[0.95rem] font-semibold transition-colors duration-300 ${
                  activo ? "bg-tinta text-crema" : "bg-tinta/[0.05] text-tinta hover:bg-tinta/10"
                }`}
              >
                {s.nombre}
              </button>
            );
          })}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${sectores.findIndex((s) => s.id === sectorId)}`}
          className="mt-6 grid gap-6 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="t-etiqueta text-gris">{sector.para}</p>
            <p className="t-h3 mt-3">{sector.titular}</p>
            <fieldset className="mt-6">
              <legend className="sr-only">Elige una tarea</legend>
              <ul className="space-y-2">
                {sector.reglas.map((r, i) => {
                  const activo = i === regla;
                  return (
                    <li key={r.cuando}>
                      <label
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
                          activo ? "border-tinta bg-papel" : "border-tinta/10 hover:border-tinta/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${base}-regla`}
                          className="sr-only"
                          checked={activo}
                          onChange={() => setRegla(i)}
                        />
                        <span className={`t-mono mt-0.5 text-[0.78rem] ${activo ? "text-amarillo-hondo" : "text-gris"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`text-[0.98rem] leading-snug ${activo ? "font-semibold text-tinta" : "text-gris"}`}>{r.cuando}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <div className="panel rejilla-puntos-oscura flex flex-col p-6 sm:p-10 lg:col-span-7" aria-live="polite">
            <div key={`${sectorId}-${regla}`} className="flex flex-1 flex-col">
              <Nodo etiqueta="Cuando" texto={actual.cuando} icono="chispa" retraso={0} />
              <div className="flujo-linea ml-[1.4rem] h-10 sm:h-12" aria-hidden="true" />
              <Nodo etiqueta="Umotion se encarga" texto="Sin que nadie tenga que acordarse ni teclearlo" icono="repetir" retraso={120} marca />
              <div className="flujo-linea ml-[1.4rem] h-10 sm:h-12" aria-hidden="true" />
              <Nodo etiqueta="Entonces" texto={actual.entonces} icono="check" retraso={240} destacado />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-crema/[0.08] pt-6">
              <p className="text-[0.9rem] text-crema/60">¿Te pasa algo parecido?</p>
              <Link
                href="/diagnostico"
                onClick={() => track("cta_click", { cta: "diagnostico", origen: "configurador", sector: sectorId })}
                className="btn btn-sm btn-amarillo"
              >
                Quiero algo así
                <Icono nombre="flecha" className="flecha size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Nodo({
  etiqueta,
  texto,
  icono,
  retraso,
  marca = false,
  destacado = false,
}: {
  etiqueta: string;
  texto: string;
  icono: "chispa" | "repetir" | "check";
  retraso: number;
  marca?: boolean;
  destacado?: boolean;
}) {
  return (
    <div className="nodo-entra flex items-start gap-4" style={{ animationDelay: `${retraso}ms` }}>
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          marca ? "bg-gradient-to-br from-amarillo-hondo to-amarillo text-tinta" : destacado ? "bg-amarillo text-tinta" : "bg-crema/[0.08] text-crema"
        }`}
      >
        <Icono nombre={icono} className="size-5" />
      </span>
      <div className="pt-0.5">
        <p className={`t-etiqueta ${destacado ? "text-amarillo" : "text-gris-claro"}`}>{etiqueta}</p>
        <p className={`mt-1.5 leading-snug ${marca ? "text-crema/60" : "text-lg font-medium text-crema sm:text-xl"}`}>{texto}</p>
      </div>
    </div>
  );
}
