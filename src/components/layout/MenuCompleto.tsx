"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/motion/Movimiento";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { Icono } from "@/components/ui/Icono";
import { negocio } from "@/data/negocio";
import { Logo } from "./Logo";
import { navegacion, navegacionSecundaria } from "./navegacion";

/** Menú a pantalla completa (móvil y tableta). Diálogo modal accesible con foco atrapado. */
export function MenuCompleto({ abierto, alCerrar }: { abierto: boolean; alCerrar: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (abierto) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      el.hidden = false;
      const previo = document.activeElement as HTMLElement | null;
      if (!reducir) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll("[data-item]"), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.9, ease: "expo.out", delay: 0.25 });
      }
      el.querySelector<HTMLElement>("button")?.focus();

      const teclado = (e: KeyboardEvent) => {
        if (e.key === "Escape") alCerrar();
        if (e.key !== "Tab") return;
        const focusables = el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero?.focus();
        }
      };
      document.addEventListener("keydown", teclado);
      return () => {
        document.removeEventListener("keydown", teclado);
        previo?.focus?.();
      };
    }

    lenis?.start();
    document.documentElement.style.overflow = "";
    if (reducir) {
      el.hidden = true;
      return;
    }
    gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.inOut", onComplete: () => void (el.hidden = true) });
  }, [abierto, alCerrar, lenis]);

  return (
    <div
      ref={ref}
      id="menu-completo"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      hidden
      data-lenis-prevent
      className="oscuro fixed inset-0 z-[60] overflow-y-auto"
    >
      <div className="marco flex min-h-full flex-col pb-10">
        <div className="flex h-[var(--cabecera)] items-center justify-between">
          <Logo sobre="oscuro" />
          <button type="button" onClick={alCerrar} className="inline-flex size-11 items-center justify-center rounded-full bg-crema/10" aria-label="Cerrar menú">
            <Icono nombre="cerrar" />
          </button>
        </div>

        <nav aria-label="Menú principal" className="mt-8 flex-1">
          <ul className="space-y-1">
            {navegacion.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <Link href={n.href} onClick={alCerrar} data-item className="flex items-baseline gap-4 py-1.5">
                  <span className="t-num w-6 text-xs text-gris-claro">0{i + 1}</span>
                  <span className="t-h1">{n.etiqueta}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-2">
            {navegacionSecundaria.map((n) => (
              <li key={n.href} data-item>
                <Link href={n.href} onClick={alCerrar} className="inline-flex rounded-full bg-amarillo px-4 py-2 text-sm font-semibold text-tinta">
                  {n.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 grid gap-6 border-t border-crema/15 pt-8 text-sm sm:grid-cols-2" data-item>
          <div>
            <p className="t-eyebrow text-gris-claro">Dónde</p>
            <p className="mt-2">
              {negocio.zona.ciudad}, en tu negocio
              <br />
              o por videollamada, estés donde estés
            </p>
            <EstadoAbierto variante="largo" className="mt-3 text-gris-claro" />
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <AccionContacto tipo="whatsapp" origen="menu" className="btn btn-whatsapp btn-sm">
              <Icono nombre="whatsapp" className="size-4" /> WhatsApp
            </AccionContacto>
            <AccionContacto tipo="llamar" origen="menu" className="btn btn-claro btn-sm">
              <Icono nombre="telefono" className="size-4" /> {negocio.telefono.visible}
            </AccionContacto>
            <AccionContacto tipo="email" origen="menu" className="btn btn-claro btn-sm">
              <Icono nombre="mail" className="size-4" /> Correo
            </AccionContacto>
          </div>
        </div>
      </div>
    </div>
  );
}
