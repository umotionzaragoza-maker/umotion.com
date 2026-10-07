import type { ReactNode } from "react";
import { Migas } from "@/components/layout/Migas";
import { titular } from "@/data/legal";
import { negocio } from "@/data/negocio";

/** Marca visible de dato pendiente de completar por el negocio. */
export function Pendiente({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-amarillo/50 px-1.5 py-0.5 font-semibold text-tinta" title={`Dato pendiente de completar por ${negocio.nombre}`}>
      [{children}]
    </mark>
  );
}

/** Muestra el dato si está relleno en src/data/legal.ts; si no, la marca de pendiente. */
export function Dato({ valor, falta }: { valor: string; falta: string }) {
  return valor ? <>{valor}</> : <Pendiente>{falta}</Pendiente>;
}

/** Correo de contacto si existe; si no, marca de pendiente. */
export function Correo() {
  return negocio.email ? <a href={`mailto:${negocio.email}`}>{negocio.email}</a> : <Pendiente>correo de contacto</Pendiente>;
}

/** El aviso de borrador desaparece solo en cuanto están los datos del titular en src/data/legal.ts. */
const faltanDatos = !titular.nombre || !titular.nif || !titular.domicilio || (titular.esSociedad && !titular.registro);

export function PaginaLegal({ titulo, ruta, children, borrador = faltanDatos }: { titulo: string; ruta: string; children: ReactNode; borrador?: boolean }) {
  return (
    <section data-tema="claro" className="bg-papel pt-[calc(var(--cabecera)+1.5rem)]">
      <div className="marco pb-[var(--seccion)]">
        <Migas tono="claro" items={[{ nombre: titulo, ruta }]} />
        <h1 className="t-h1 mt-8 max-w-3xl">{titulo}</h1>
        {borrador && (
          <p className="mt-6 max-w-3xl rounded-2xl bg-amarillo/25 p-5 text-sm">
            <strong>Pendiente de revisión por la asesoría.</strong> Los campos marcados entre corchetes (datos del titular) deben
            completarse en <code>src/data/legal.ts</code> antes de publicar la web. El resto describe con exactitud cómo funciona esta web.
          </p>
        )}
        <div className="mt-10 max-w-3xl space-y-5 text-[1.02rem] leading-relaxed text-gris [&_a]:text-texto [&_a]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.6rem] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.02em] [&_h2]:text-texto [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-texto [&_table]:w-full [&_td]:border-b [&_td]:border-tinta/10 [&_td]:py-3 [&_td]:pr-4 [&_th]:border-b [&_th]:border-tinta/20 [&_th]:py-3 [&_th]:pr-4 [&_th]:text-left [&_th]:text-texto">
          {children}
        </div>
      </div>
    </section>
  );
}
