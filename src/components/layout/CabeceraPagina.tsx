import type { ReactNode } from "react";
import type { FotoKey } from "@/lib/fotos";
import { Migas, type Miga } from "./Migas";

/**
 * Encabezado de página interior (v2): claro, sobre la rejilla de puntos del sistema.
 * `foto` y `altFoto` se aceptan por compatibilidad, pero la v2 no usa fotos de cabecera:
 * el titular es el protagonista y la página carga más rápido.
 */
export function CabeceraPagina({
  eyebrow,
  titulo,
  entradilla,
  migas,
  children,
}: {
  eyebrow: string;
  titulo: ReactNode;
  entradilla?: ReactNode;
  migas: Miga[];
  foto?: FotoKey;
  altFoto?: string;
  children?: ReactNode;
}) {
  return (
    <section data-tema="claro" className="relative isolate overflow-hidden bg-papel pt-[calc(var(--cabecera)+2.5rem)]" aria-labelledby="titulo-pagina">
      <div className="rejilla-puntos absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black_25%,transparent_75%)]" aria-hidden="true" />
      <div
        className="absolute -right-48 -top-48 -z-10 size-[40rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(53 200 255 / 0.25), rgb(43 82 240 / 0.06) 60%, transparent)" }}
        aria-hidden="true"
      />
      <div className="marco pb-16 md:pb-24">
        <Migas items={migas} tono="claro" />
        <p className="entrada t-etiqueta mt-10 text-amarillo-hondo">{eyebrow}</p>
        <h1 id="titulo-pagina" className="entrada-titular t-display mt-5 max-w-5xl text-tinta" style={{ "--retraso": "0.1s" } as React.CSSProperties}>
          {titulo}
        </h1>
        {entradilla && (
          <div className="entrada t-lead mt-6 max-w-2xl text-gris" style={{ "--retraso": "0.35s" } as React.CSSProperties}>
            {entradilla}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
