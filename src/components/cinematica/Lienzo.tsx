"use client";

import { useEffect, useRef } from "react";
import { capitulos } from "@/data/guion";
import type { Cine } from "./motor";

/**
 * Fondo cinemático de la portada: un lienzo fijo detrás del contenido. Lee el desplazamiento y le dice al motor
 * en qué punto de la película está (0 = primer capítulo; 1,5 = a medio camino del segundo al tercero).
 * El motor se carga aparte (Three.js pesa) y solo si el navegador tiene WebGL 2. Sin él, queda el degradado.
 */
export function Lienzo() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    if (!document.createElement("canvas").getContext("webgl2")) return;

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cine: Cine | null = null;
    let vivo = true;
    let raf = 0;

    const secciones = () => Array.from(document.querySelectorAll<HTMLElement>("[data-capitulo]"));

    // Cada capítulo empieza a transformarse cuando su sección asoma por la mitad inferior de la pantalla.
    const posicion = () => {
      const vh = window.innerHeight;
      let x = 0;
      secciones().forEach((s, i) => {
        if (i === 0) return;
        const top = s.getBoundingClientRect().top;
        x += Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.7)));
      });
      return x;
    };
    const alDesplazar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = posicion();
        cine?.irA(x);
        document.documentElement.style.setProperty("--capitulo", String(x));
        window.dispatchEvent(new CustomEvent("capitulo", { detail: x }));
      });
    };

    void import("./motor").then(({ montarCine }) => {
      if (!vivo) return;
      try {
        cine = montarCine(lienzo, {
          escenas: capitulos.map((c) => c.escena),
          lados: capitulos.map((c) => (c.lado === "izquierda" ? 1 : -1)),
          reducir,
        });
        lienzo.dataset.listo = "";
        alDesplazar();
      } catch {
        // Sin WebGL utilizable: se queda el degradado de fondo.
      }
    });

    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar, { passive: true });
    alDesplazar();
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
      cine?.destruir();
    };
  }, []);

  return (
    <div className="cine-fondo" aria-hidden="true">
      <canvas ref={ref} className="cine-lienzo" />
      <div className="cine-vineta" />
    </div>
  );
}
