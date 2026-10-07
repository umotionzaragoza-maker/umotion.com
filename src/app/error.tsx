"use client";

import Link from "next/link";
import { enlaces, negocio, saludoWhatsApp } from "@/data/negocio";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section data-tema="oscuro" className="oscuro flex min-h-[80svh] items-center pt-[var(--cabecera)]">
      <div className="marco py-20">
        <p className="t-eyebrow text-amarillo">Algo ha fallado</p>
        <h1 className="t-display mt-6 max-w-4xl">
          Hasta la mejor automatización <span className="italica text-amarillo">tropieza.</span>
        </h1>
        <p className="t-lead mt-6 max-w-xl text-crema/75">
          Ha ocurrido un error inesperado. Prueba otra vez; si sigue pasando, escríbenos por WhatsApp y lo vemos contigo.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-amarillo">
            Reintentar
          </button>
          <a href={enlaces.whatsapp(saludoWhatsApp)} className="btn btn-claro" target="_blank" rel="noopener noreferrer">
            WhatsApp {negocio.telefono.visible}
          </a>
          <Link href="/" className="btn btn-claro">
            Inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
