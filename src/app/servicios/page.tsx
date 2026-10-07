import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icono } from "@/components/ui/Icono";
import { familias, serviciosDe } from "@/data/servicios";
import { metadatos, serviciosJsonLd } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Servicios: webs, tiendas, marketing y automatización",
  descripcion:
    "Análisis y consultoría, webs, tiendas online, marketing digital y automatización de procesos con IA para negocios de Zaragoza. Primer diagnóstico gratuito.",
  ruta: "/servicios",
});

export default function Servicios() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Servicios"
        titulo={
          <>
            Tres frentes, <span className="italica text-amarillo">un mismo objetivo.</span>
          </>
        }
        entradilla="Entender tu negocio, traerte más clientes y quitarte el trabajo que se repite. Todo empieza por un diagnóstico gratuito; el resto se presupuesta a tu medida."
        migas={[{ nombre: "Servicios", ruta: "/servicios" }]}
      >
        <ul className="mt-12 flex flex-wrap gap-3">
          {familias.map((f, i) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                className={`inline-flex min-h-[3.25rem] items-center gap-3 rounded-full px-6 font-semibold transition-colors ${
                  i === 0 ? "bg-tinta text-crema hover:bg-carbon" : "bg-tinta/[0.06] text-tinta hover:bg-tinta/10"
                }`}
              >
                <span className={`t-mono text-[0.8rem] ${i === 0 ? "text-amarillo" : "text-amarillo-hondo"}`}>{String.fromCharCode(65 + i)}</span>
                {f.nombre}
                <span className="t-mono text-[0.75rem] opacity-60">{serviciosDe(f.id).length}</span>
              </a>
            </li>
          ))}
        </ul>
      </CabeceraPagina>

      {familias.map((f, i) => (
        <section
          key={f.id}
          id={f.id}
          data-tema="claro"
          className={i % 2 ? "bg-papel" : "bg-crema"}
          aria-labelledby={`titulo-${f.id}`}
        >
          <div className="marco seccion">
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="t-etiqueta text-amarillo-hondo">{String.fromCharCode(65 + i)} · {f.nombre}</p>
                <h2 id={`titulo-${f.id}`} className="t-display mt-5" data-titular>
                  {f.titular.split(",")[0]}
                  {f.titular.includes(",") ? (
                    <>
                      , <span className="italica text-amarillo-hondo">{f.titular.split(",").slice(1).join(",").trim()}</span>
                    </>
                  ) : null}
                </h2>
              </div>
              <p className="text-lg text-gris md:col-span-5" data-reveal>
                {f.texto}
              </p>
            </div>

            <ul className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-reveal="linea">
              {serviciosDe(f.id).map((s) => (
                <li key={s.slug} id={s.slug} className="scroll-mt-[calc(var(--cabecera)+1.5rem)]">
                  <article className={`flex h-full flex-col rounded-[1.75rem] p-7 md:p-8 ${s.precio === "gratis" ? "bg-tinta text-crema" : "bg-crema ring-1 ring-tinta/10"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <span className={`grid size-12 place-items-center rounded-2xl ${s.precio === "gratis" ? "bg-amarillo text-tinta" : "bg-tinta text-amarillo"}`}>
                        <Icono nombre={s.icono} className="size-6" />
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.precio === "gratis" ? "bg-amarillo text-tinta" : "bg-tinta/[0.06] text-gris"
                        }`}
                      >
                        {s.precio === "gratis" ? "Gratis" : "Precio a consultar"}
                      </span>
                    </div>
                    <h3 className="t-h3 mt-7">{s.nombre}</h3>
                    <p className={`mt-2 font-semibold ${s.precio === "gratis" ? "text-amarillo" : "text-amarillo-hondo"}`}>{s.titular}</p>
                    <p className={`mt-3 flex-1 ${s.precio === "gratis" ? "text-crema/75" : "text-gris"}`}>{s.descripcion}</p>
                    <ul className="mt-6 space-y-2 border-t border-current/10 pt-5 text-sm">
                      {s.ejemplos.map((e) => (
                        <li key={e} className="flex items-start gap-2">
                          <Icono nombre="check" className={`mt-0.5 size-4 shrink-0 ${s.precio === "gratis" ? "text-amarillo" : "text-amarillo-hondo"}`} />
                          {e}
                        </li>
                      ))}
                    </ul>
                    {s.precio === "gratis" && (
                      <Link href="/diagnostico" className="btn btn-amarillo btn-sm mt-7 self-start">
                        Pedir diagnóstico <Icono nombre="flecha" className="flecha size-4" />
                      </Link>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section data-tema="claro" className="bg-papel" aria-labelledby="titulo-precios">
        <div className="marco pb-[var(--seccion)]">
          <div className="panel rejilla-puntos-oscura flex flex-wrap items-center justify-between gap-8 p-8 md:p-14">
            <div className="max-w-3xl">
              <p className="t-etiqueta text-amarillo">Sobre el precio</p>
              <h2 id="titulo-precios" className="t-h1 mt-4">
                No damos precios cerrados sin conocer tu caso. <span className="text-gris-claro">Te lo decimos antes de empezar nada.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-crema/70">
                Cada negocio necesita cosas distintas. Después del diagnóstico gratuito te enviamos un presupuesto escrito con el alcance,
                lo que entregamos, lo que necesitamos de ti, el precio y los plazos. Tú decides.
              </p>
            </div>
            <Link href="/diagnostico" className="btn btn-amarillo">
              Pide tu diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={serviciosJsonLd()} />
    </>
  );
}
