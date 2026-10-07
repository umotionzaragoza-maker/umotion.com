"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icono } from "./Icono";

/** Carrusel nativo (scroll-snap) con controles accesibles. Arrastre táctil nativo en móvil. */
export function Carrusel({ children, etiqueta, tono = "claro" }: { children: ReactNode; etiqueta: string; tono?: "claro" | "oscuro" }) {
  const pista = useRef<HTMLUListElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fin, setFin] = useState(false);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => {
      setInicio(el.scrollLeft < 8);
      setFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reducir ? "auto" : "smooth" });
  };

  const boton = `grid size-12 place-items-center rounded-full transition-colors disabled:opacity-30 ${
    tono === "oscuro" ? "bg-crema/10 hover:bg-crema/20" : "bg-tinta/[0.06] hover:bg-tinta/10"
  }`;

  return (
    <div role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
      <div className="marco mb-6 flex justify-end gap-2">
        <button type="button" className={boton} onClick={() => mover(-1)} disabled={inicio} aria-label="Anteriores">
          <Icono nombre="flecha" className="size-5 rotate-180" />
        </button>
        <button type="button" className={boton} onClick={() => mover(1)} disabled={fin} aria-label="Siguientes">
          <Icono nombre="flecha" className="size-5" />
        </button>
      </div>
      <ul
        ref={pista}
        data-lenis-prevent-wheel
        className="ocultar-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-4 md:gap-7"
      >
        {children}
      </ul>
    </div>
  );
}
