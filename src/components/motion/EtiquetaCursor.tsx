"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

/**
 * Etiqueta que acompaña al puntero sobre elementos con data-cursor="Texto".
 * Solo con ratón y sin "reducir movimiento". Es decorativa: el cursor del sistema
 * sigue visible y el enlace ya tiene su propio texto accesible.
 */
export function EtiquetaCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fino || reducir || !el) return;

    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let actual = "";

    const mover = (e: PointerEvent) => {
      x(e.clientX + 18);
      y(e.clientY + 18);
      const objetivo = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const nuevo = objetivo?.dataset.cursor ?? "";
      if (nuevo !== actual) {
        actual = nuevo;
        if (nuevo) setTexto(nuevo);
        gsap.to(el, { scale: nuevo ? 1 : 0.4, autoAlpha: nuevo ? 1 : 0, duration: 0.35, ease: "power3.out" });
      }
    };
    const salir = () => {
      actual = "";
      gsap.to(el, { autoAlpha: 0, scale: 0.4, duration: 0.25 });
    };

    gsap.set(el, { autoAlpha: 0, scale: 0.4 });
    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", salir);
    return () => {
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", salir);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden rounded-full bg-amarillo px-4 py-2 text-[0.8rem] font-semibold text-tinta opacity-0 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      {texto}
    </div>
  );
}
