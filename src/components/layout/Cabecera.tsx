"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { Icono } from "@/components/ui/Icono";
import { track } from "@/lib/analytics";
import { Logo } from "./Logo";
import { MenuCompleto } from "./MenuCompleto";
import { navegacion } from "./navegacion";

export function Cabecera() {
  const pathname = usePathname();
  const [desplazado, setDesplazado] = useState(false);
  const [oculta, setOculta] = useState(false);
  const [menu, setMenu] = useState(false);
  const ultimoY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const alDesplazar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setDesplazado(y > 24);
        setOculta(y > 480 && y > ultimoY.current + 4);
        if (y < ultimoY.current - 4 || y < 480) setOculta(false);
        ultimoY.current = y;
      });
    };
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alDesplazar);
    };
  }, []);

  const cerrarMenu = useCallback(() => setMenu(false), []);
  useEffect(() => setMenu(false), [pathname]);

  // v2: cabecera clara siempre (como en el diseño), translúcida para que se intuya lo que pasa por debajo.
  const fondo = desplazado
    ? "bg-papel/85 backdrop-blur-xl shadow-[0_1px_0_rgb(8_10_20/0.08)]"
    : "bg-papel/70 backdrop-blur-xl shadow-[0_1px_0_rgb(8_10_20/0.05)]";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-tinta transition-[transform,background-color] duration-500 ease-[var(--ease-seda)] ${fondo} ${
          oculta && !menu ? "-translate-y-full" : "translate-y-0"
        }`}
        data-cabecera="claro"
      >
        <div className="marco flex h-[var(--cabecera)] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 -m-2 p-2" aria-label="Umotion, ir al inicio">
            <Logo sobre="claro" prioridad />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navegacion.map((n) => {
                const activo = pathname === n.href || pathname.startsWith(`${n.href}/`);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={activo ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full px-4 text-[0.93rem] font-medium transition-colors ${
                        activo ? "bg-tinta/[0.07]" : "hover:bg-tinta/[0.04]"
                      }`}
                    >
                      {n.etiqueta}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/contacto#donde"
              className="hidden items-center rounded-full px-3 py-2 text-[0.82rem] font-medium opacity-90 hover:opacity-100 xl:inline-flex"
            >
              <EstadoAbierto />
            </Link>

            <Link
              href="/diagnostico"
              onClick={() => track("cta_click", { cta: "diagnostico", origen: "cabecera" })}
              className="btn btn-sm max-sm:!px-4"
              aria-current={pathname === "/diagnostico" ? "page" : undefined}
            >
              <span className="sm:hidden">Diagnóstico</span>
              <span className="hidden sm:inline">Diagnóstico gratis</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenu(true)}
              className="inline-flex size-11 items-center justify-center rounded-full bg-tinta/[0.06] lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={menu}
              aria-controls="menu-completo"
            >
              <Icono nombre="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MenuCompleto abierto={menu} alCerrar={cerrarMenu} />
    </>
  );
}
