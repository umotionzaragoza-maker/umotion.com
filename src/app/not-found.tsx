import type { Metadata } from "next";
import Link from "next/link";
import { Icono } from "@/components/ui/Icono";
import { navegacion } from "@/components/layout/navegacion";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha cambiado de sitio. Vuelve al inicio de Umotion o pide tu diagnóstico gratuito de automatización.",
};

export default function NoEncontrada() {
  return (
    <section data-tema="oscuro" className="oscuro flex min-h-[100svh] items-center pt-[var(--cabecera)]">
      <div className="marco py-20">
        <p className="t-eyebrow text-amarillo">Error 404</p>
        <h1 className="t-mega mt-6 max-w-5xl">
          Esta página no está <span className="italica text-amarillo">automatizada.</span>
        </h1>
        <p className="t-lead mt-6 max-w-xl text-crema/75">
          La página que buscas no existe o ha cambiado de sitio. Desde aquí puedes volver a todo lo demás.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/diagnostico" className="btn btn-amarillo">
            Pedir diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
          </Link>
          <Link href="/" className="btn btn-claro">
            Volver al inicio
          </Link>
        </div>
        <ul className="mt-16 flex flex-wrap gap-2 text-sm">
          {navegacion.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="inline-flex rounded-full border border-crema/20 px-4 py-2 hover:border-crema/60">
                {n.etiqueta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
