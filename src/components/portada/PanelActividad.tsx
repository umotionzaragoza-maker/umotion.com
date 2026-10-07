"use client";

import { useEffect, useRef, useState } from "react";
import { Icono } from "@/components/ui/Icono";
import { sectores } from "@/data/sectores";

/**
 * Registro de actividad SIMULADO: enseña en diez segundos qué es automatizar.
 * Las reglas salen de src/data/sectores.ts (ejemplos, no casos de clientes) y la
 * tarjeta lo dice en su cabecera. Sin cifras inventadas: solo la hora del día simulado.
 */

type Evento = { id: number; hora: string; sector: string; cuando: string; entonces: string };

// Intercala los sectores para que el registro parezca un día real y variado.
const reglas = [0, 1, 2, 3].flatMap((i) =>
  sectores.flatMap((s) => (s.reglas[i] ? [{ sector: s.nombre, ...s.reglas[i] }] : [])),
);
// Horas del día simulado: de 8:52 a 21:40, en saltos irregulares.
const saltos = [0, 23, 41, 18, 57, 34, 26, 49, 38, 61, 29, 44, 52, 36, 47, 33];
const horas = saltos.reduce<number[]>((acc, s) => [...acc, (acc.at(-1) ?? 8 * 60 + 52) + s], []);
const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const evento = (n: number): Evento => {
  const r = reglas[n % reglas.length]!;
  return { id: n, hora: fmt(horas[n % horas.length]!), sector: r.sector, cuando: r.cuando, entonces: r.entonces };
};

const VISIBLES = 3;
const INICIALES = Array.from({ length: VISIBLES }, (_, i) => evento(VISIBLES - 1 - i));

export function PanelActividad() {
  const [eventos, setEventos] = useState<Evento[]>(INICIALES);
  const [enPausa, setEnPausa] = useState(false);
  const siguiente = useRef(VISIBLES);
  const raiz = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnPausa(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => (visible.current = Boolean(e?.isIntersecting)));
    if (raiz.current) io.observe(raiz.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (enPausa) return;
    const id = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      const n = siguiente.current++;
      setEventos((prev) => [evento(n), ...prev].slice(0, VISIBLES));
    }, 2800);
    return () => window.clearInterval(id);
  }, [enPausa]);

  return (
    <div ref={raiz} className="panel rejilla-puntos-oscura p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative grid size-9 place-items-center rounded-xl bg-crema/[0.07] text-amarillo">
            <Icono nombre="repetir" className="size-[18px]" />
          </span>
          <div>
            <p className="text-[0.95rem] font-semibold leading-tight">Un día en tu negocio</p>
            <p className="t-etiqueta mt-1 text-gris-claro">Simulación · ejemplos</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEnPausa((p) => !p)}
          className="grid size-10 place-items-center rounded-full bg-crema/[0.07] text-crema/80 transition-colors hover:bg-crema/15"
          aria-label={enPausa ? "Reanudar la simulación" : "Pausar la simulación"}
        >
          <Icono nombre={enPausa ? "play" : "pausa"} className="size-4" />
        </button>
      </div>

      <ol className="mt-6 h-[30rem] space-y-3 overflow-hidden [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:h-[28.5rem]" aria-live="off">
        {eventos.map((e, i) => (
          <li
            key={e.id}
            className={`rounded-2xl border border-crema/[0.08] bg-crema/[0.035] p-4 transition-opacity duration-700 ${
              e.id >= VISIBLES ? "evento-nuevo" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="t-mono text-[0.78rem] text-amarillo">{e.hora}</span>
              <span className="t-etiqueta truncate text-gris-claro">{e.sector}</span>
            </div>
            <p className="mt-2 text-[0.92rem] leading-snug text-crema/70">
              <span className="t-etiqueta mr-2 text-crema/45">Cuando</span>
              {e.cuando}
            </p>
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <p className="text-[0.92rem] font-medium leading-snug text-crema">
                <span className="t-etiqueta mr-2 text-amarillo/80">Entonces</span>
                {e.entonces}
              </p>
              <span className="evento-check mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-amarillo text-tinta" aria-label="Hecho">
                <Icono nombre="check" className="size-3" strokeWidth={2.4} />
              </span>
            </div>
            <span className="evento-barra mt-3 block h-px w-0 bg-gradient-to-r from-amarillo-hondo to-amarillo" aria-hidden="true" />
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center gap-3 border-t border-crema/[0.08] pt-5 text-[0.88rem] text-crema/65">
        <span className="size-2 shrink-0 rounded-full bg-amarillo animate-pulso" aria-hidden="true" />
        Y tú, mientras tanto, atendiendo a tus clientes.
      </div>
    </div>
  );
}
