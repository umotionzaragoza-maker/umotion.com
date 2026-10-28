"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icono } from "@/components/ui/Icono";
import { pasos } from "@/data/metodo";
import type { Grulla } from "./grulla/motor";
import grullaFija from "./grulla/grulla.png";

/**
 * 03 — Cómo trabajamos. Las cuatro tarjetas a la izquierda y, fijo a la derecha (arriba en móvil),
 * un panel donde una hoja se dobla hasta ser la grulla de Umotion según la tarjeta que esté en el centro:
 *   01 hoja plana con los pliegues · 02 base preliminar · 03 grulla · 04 vuela.
 * El 3D (Three.js + modelo de Blender) se descarga solo al acercarse a la sección. Sin WebGL o con
 * «reducir movimiento» se queda la imagen fija y las tarjetas normales.
 */

/** Posición del centro útil de la pantalla respecto a las tarjetas: 0 = tarjeta 1 … 3 = tarjeta 4. */
function posicion(ol: HTMLOListElement, panel: HTMLElement | null) {
  // En móvil el panel va fijo arriba: el «centro» es el del hueco que queda debajo.
  const abajo = panel && window.innerWidth < 1024 ? panel.getBoundingClientRect().bottom : 0;
  const mitad = abajo + (window.innerHeight - abajo) * 0.5;
  const centros = Array.from(ol.children).map((li) => {
    const r = li.getBoundingClientRect();
    return r.top + r.height / 2;
  });
  if (mitad <= centros[0]!) return 0;
  for (let i = 0; i < centros.length - 1; i++) {
    const a = centros[i]!;
    const b = centros[i + 1]!;
    if (mitad <= b) return i + (mitad - a) / (b - a);
  }
  return centros.length - 1;
}

/** Cada tarjeta muestra su estado completo; los cambios ocurren al pasar de una a otra. */
const aFase = (q: number) => {
  const i = Math.floor(q);
  const t = Math.min(1, Math.max(0, (q - i - 0.2) / 0.6));
  return i + t;
};

function webgl() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export function Pasos() {
  const seccion = useRef<HTMLElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const escena = useRef<HTMLDivElement>(null);
  const fijo = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [con3d, setCon3d] = useState(false);

  useEffect(() => {
    const host = escena.current;
    const ol = lista.current;
    const sec = seccion.current;
    if (!host || !ol || !sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let grulla: Grulla | null = null;
    let cancelado = false;
    let raf = 0;

    const medir = () => {
      raf = 0;
      const q = posicion(ol, fijo.current);
      setActivo(Math.round(q));
      grulla?.fase(aFase(q));
    };
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    // El 3D se carga cuando la sección está a menos de una pantalla.
    const cerca = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        cerca.disconnect();
        if (!webgl()) return;
        import("./grulla/motor")
          .then(({ montarGrulla }) =>
            montarGrulla(host, { interactiva: window.matchMedia("(hover: hover) and (pointer: fine)").matches }),
          )
          .then((g) => {
            if (cancelado) return g.destruir();
            grulla = g;
            setCon3d(true);
            medir();
          })
          .catch((err: unknown) => {
            // Sin WebGL o sin modelo: se queda la imagen fija.
            console.warn("Grulla 3D no disponible", err);
          });
      },
      { rootMargin: "100% 0px" },
    );
    cerca.observe(sec);

    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    medir();
    return () => {
      cancelado = true;
      cerca.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
      grulla?.destruir();
    };
  }, []);

  return (
    <section ref={seccion} data-tema="claro" className="bg-crema" aria-labelledby="titulo-pasos">
      <div className="marco seccion">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-etiqueta text-amarillo-hondo">03 · Cómo trabajamos</p>
            <h2 id="titulo-pasos" className="t-display mt-5">
              Cuatro pasos. <span className="text-niebla">El primero es gratis.</span>
            </h2>
          </div>
          <Link href="/metodo" className="enlace">
            El método en detalle
            <Icono nombre="flecha" className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Panel 3D: arriba en móvil, a la derecha en escritorio. Fijo mientras se recorren los pasos. */}
          <div
            ref={fijo}
            className="sticky top-[calc(var(--cabecera)+0.75rem)] z-10 lg:order-2 lg:col-span-7 lg:top-[calc(var(--cabecera)+2rem)] lg:self-start"
          >
            <div className="panel rejilla-puntos-oscura relative h-[36svh] min-h-[15rem] lg:h-[min(78svh,46rem)]">
              <div ref={escena} className="absolute inset-0" />
              {!con3d && (
                <Image
                  src={grullaFija}
                  alt="Grulla de papel de Umotion"
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="absolute inset-0 m-auto h-4/5 w-auto object-contain"
                />
              )}
              <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
                <span className="t-mono text-[0.85rem] text-amarillo">{String(activo + 1).padStart(2, "0")} / 04</span>
                <span className="t-etiqueta text-gris-claro">{pasos[activo]?.titulo}</span>
              </div>
              {con3d && (
                <p className="t-etiqueta pointer-events-none absolute right-5 bottom-5 hidden text-crema/40 sm:right-7 sm:bottom-7 lg:block">
                  Arrastra para girar
                </p>
              )}
            </div>
          </div>

          <ol ref={lista} className="grid gap-4 pb-[30svh] lg:order-1 lg:col-span-5 lg:gap-[22svh] lg:pt-[12svh] lg:pb-[36svh]">
            {pasos.map((p, i) => {
              const on = i === activo;
              return (
                <li
                  key={p.titulo}
                  aria-current={on ? "step" : undefined}
                  className={`relative flex flex-col rounded-3xl p-7 transition-[background-color,color,box-shadow] duration-500 ease-[var(--ease-seda)] ${
                    on ? "bg-tinta text-crema shadow-[0_30px_60px_-30px_rgb(43_82_240/0.55)]" : "border border-tinta/10 bg-papel"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`t-mono text-[0.85rem] ${on ? "text-amarillo" : "text-gris"}`}>
                      {String(i + 1).padStart(2, "0")} / 04
                    </span>
                    {i === 0 && <span className="chip t-etiqueta bg-amarillo text-tinta">Gratis</span>}
                  </div>
                  <h3 className="t-h3 mt-6 md:mt-8">{p.titulo}</h3>
                  <p className={`mt-3 text-[0.97rem] ${on ? "text-crema/70" : "text-gris"}`}>{p.texto}</p>
                  <p
                    className={`mt-6 flex items-start gap-2 border-t pt-5 text-[0.88rem] font-medium ${
                      on ? "border-crema/10" : "border-tinta/10"
                    }`}
                  >
                    <Icono nombre="check" className={`mt-0.5 size-4 shrink-0 ${on ? "text-amarillo" : "text-amarillo-hondo"}`} />
                    {p.resultado}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
