"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { Icono } from "@/components/ui/Icono";
import { track } from "@/lib/analytics";

/**
 * Barra de acciones persistente en móvil: las tres cosas que más se hacen con el pulgar.
 * Objetivos táctiles de 56 px (WCAG 2.2 · 2.5.8) y respeta la zona segura inferior.
 */
export function BarraMovil() {
  const pathname = usePathname();
  const enDiagnostico = pathname === "/diagnostico";

  const item = "flex flex-1 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold tracking-wide";

  return (
    <nav
      aria-label="Acciones rápidas"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-crema/10 bg-tinta/92 pb-[env(safe-area-inset-bottom)] text-crema backdrop-blur-xl md:hidden"
    >
      <div className="flex h-[68px] items-stretch px-2">
        <Link
          href="/diagnostico"
          aria-current={enDiagnostico ? "page" : undefined}
          onClick={() => track("cta_click", { cta: "diagnostico", origen: "barra-movil" })}
          className={`${item} text-amarillo`}
        >
          <Icono nombre="radar" className="size-[1.35rem]" />
          Diagnóstico
        </Link>
        <AccionContacto tipo="whatsapp" origen="barra-movil" className={`${item} text-[#7ee2a2]`}>
          <Icono nombre="whatsapp" className="size-[1.35rem]" />
          WhatsApp
        </AccionContacto>
        <AccionContacto tipo="llamar" origen="barra-movil" className={item}>
          <Icono nombre="telefono" className="size-[1.35rem]" />
          Llamar
        </AccionContacto>
      </div>
    </nav>
  );
}
