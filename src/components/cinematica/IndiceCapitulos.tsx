"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/motion/Movimiento";
import { capitulos } from "@/data/guion";

/** Índice lateral de la portada (pantallas anchas): marca el capítulo en curso y lleva a cada uno. */
export function IndiceCapitulos() {
  const [actual, setActual] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const alCambiar = (e: Event) => setActual(Math.round((e as CustomEvent<number>).detail));
    window.addEventListener("capitulo", alCambiar);
    return () => window.removeEventListener("capitulo", alCambiar);
  }, []);

  return (
    <nav aria-label="Capítulos de la portada" className="cine-indice">
      <ol>
        {capitulos.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={i === actual ? "step" : undefined}
              onClick={(e) => {
                if (!lenis) return;
                e.preventDefault();
                lenis.scrollTo(`#${c.id}`, { duration: 1.6 });
              }}
            >
              <span className="t-etiqueta">{String(i + 1).padStart(3, "0")}</span>
              <span className="cine-indice-nombre">{c.nombre}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
