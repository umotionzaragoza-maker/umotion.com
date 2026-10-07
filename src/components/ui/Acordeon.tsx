"use client";

import { useId, useState } from "react";
import { Icono } from "./Icono";

/** Acordeón accesible (patrón de divulgación WAI-ARIA). */
export function Acordeon({
  items,
  tono = "claro",
  nivel = 3,
}: {
  items: { p: string; r: string }[];
  tono?: "claro" | "oscuro";
  /** Nivel de título de cada pregunta, para respetar la jerarquía de la página. */
  nivel?: 2 | 3 | 4;
}) {
  const Titulo = `h${nivel}` as "h2" | "h3" | "h4";
  const [abierto, setAbierto] = useState<number | null>(0);
  const base = useId();
  const borde = tono === "oscuro" ? "border-crema/15" : "border-tinta/12";

  return (
    <div className={`border-t ${borde}`}>
      {items.map((it, i) => {
        const id = `${base}-${i}`;
        const activo = abierto === i;
        return (
          <div key={it.p} className={`border-b ${borde}`}>
            <Titulo>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={activo}
                aria-controls={id}
                onClick={() => setAbierto(activo ? null : i)}
              >
                <span className="font-display text-xl leading-snug md:text-2xl" style={{ fontVariationSettings: '"opsz" 36' }}>
                  {it.p}
                </span>
                <span className={`grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-500 ${activo ? "rotate-45 bg-amarillo text-tinta" : tono === "oscuro" ? "bg-crema/10" : "bg-tinta/[0.06]"}`}>
                  <Icono nombre="mas" className="size-4" />
                </span>
              </button>
            </Titulo>
            <div id={id} role="region" hidden={!activo} className="pb-7 pr-16">
              <p className={tono === "oscuro" ? "text-crema/75" : "text-gris"}>{it.r}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
