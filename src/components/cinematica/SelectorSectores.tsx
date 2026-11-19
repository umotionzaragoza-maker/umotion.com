"use client";

import { useId, useState } from "react";
import { sectores } from "@/data/sectores";

/** Pestañas por tipo de negocio con sus reglas «Cuando… → Entonces…» (ejemplos de sectores.ts). */
export function SelectorSectores() {
  const [activo, setActivo] = useState(0);
  const base = useId();
  const sector = sectores[activo]!;

  return (
    <div className="cine-vidrio p-5 md:p-8">
      <div role="tablist" aria-label="Tipo de negocio" className="flex flex-wrap gap-2">
        {sectores.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === activo}
            aria-controls={`${base}-panel`}
            onClick={() => setActivo(i)}
            className={`cine-pildora ${i === activo ? "cine-pildora--activa" : ""}`}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${activo}`} className="mt-7">
        <p className="t-etiqueta text-gris-claro">{sector.para}</p>
        <p className="t-h3 mt-2 text-crema">{sector.titular}</p>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {sector.reglas.map((r, i) => (
            <li key={`${sector.id}-${i}`} className="cine-regla">
              <span className="t-etiqueta text-amarillo">Cuando</span>
              <span className="mt-1 block text-crema">{r.cuando}</span>
              <span className="t-etiqueta mt-3 block text-amarillo">Entonces</span>
              <span className="mt-1 block text-gris-claro">{r.entonces}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[0.82rem] text-gris-claro">Ejemplos de lo que se puede automatizar, no casos de clientes.</p>
      </div>
    </div>
  );
}
