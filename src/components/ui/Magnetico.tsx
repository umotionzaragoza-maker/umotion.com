"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

/** Atrae suavemente el contenido hacia el cursor. Solo con ratón y sin "reducir movimiento". */
export function Magnetico({ children, fuerza = 0.28, className = "" }: { children: ReactNode; fuerza?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || reducir) return;

    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * fuerza);
      y((e.clientY - (r.top + r.height / 2)) * fuerza);
    };
    const salir = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
    };
  }, [fuerza]);

  return (
    <span ref={ref} className={`inline-flex will-change-transform ${className}`}>
      {children}
    </span>
  );
}
