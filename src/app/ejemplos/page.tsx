import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Icono } from "@/components/ui/Icono";
import { Regla } from "@/components/ui/Regla";
import { sectores } from "@/data/sectores";
import { fotos } from "@/lib/fotos";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Ejemplos de automatización por tipo de negocio",
  descripcion:
    "Qué se puede automatizar en un bar, una tienda, un despacho o una pyme: reservas, encargos, citas, facturas, correos e informes. Ideas concretas por tipo de negocio.",
  ruta: "/ejemplos",
});

export default function Ejemplos() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Ejemplos"
        titulo={
          <>
            Si se repite, <span className="italica text-amarillo">se puede automatizar.</span>
          </>
        }
        entradilla="Cada automatización es una regla sencilla: cuando pasa algo, entonces ocurre otra cosa sin que tengas que hacerla tú. Estos son ejemplos habituales por tipo de negocio."
        migas={[{ nombre: "Ejemplos", ruta: "/ejemplos" }]}
        foto="marca"
      >
        <ul className="mt-10 flex flex-wrap gap-2">
          {sectores.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex min-h-11 items-center rounded-full border border-crema/25 px-5 text-sm font-semibold hover:border-crema/60">
                {s.nombre}
              </a>
            </li>
          ))}
        </ul>
      </CabeceraPagina>

      <section data-tema="claro" className="bg-papel" aria-label="Aviso sobre los ejemplos">
        <div className="marco pt-12">
          <p className="flex max-w-3xl items-start gap-3 rounded-2xl bg-hueso p-5 text-sm text-gris">
            <Icono nombre="info" className="mt-0.5 size-5 shrink-0 text-amarillo-hondo" />
            Son ejemplos de lo que se puede automatizar, no casos de clientes. En el diagnóstico gratuito vemos cuáles tienen
            sentido en tu negocio y con tus herramientas.
          </p>
        </div>
      </section>

      {sectores.map((s, i) => (
        <section key={s.id} id={s.id} data-tema="claro" className={`scroll-mt-[var(--cabecera)] ${i % 2 ? "bg-hueso" : "bg-papel"}`} aria-labelledby={`titulo-${s.id}`}>
          <div className="marco seccion grid gap-12 lg:grid-cols-12">
            <div className={`lg:col-span-4 ${i % 2 ? "lg:order-2 lg:col-start-9" : ""}`}>
              <div className="lg:sticky lg:top-[calc(var(--cabecera)+2rem)]">
                <p className="t-eyebrow text-gris">
                  <span className="t-num">0{i + 1}</span> / {s.para}
                </p>
                <h2 id={`titulo-${s.id}`} className="t-h1 mt-4" data-titular>
                  {s.nombre}
                </h2>
                <p className="t-lead mt-4 text-gris">{s.titular}</p>
                <div data-mascara className="foto relative mt-8 aspect-[16/10] max-w-sm overflow-hidden rounded-[1.5rem] lg:aspect-[4/5]">
                  <Image src={fotos[s.foto]} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 26vw, 90vw" className="object-cover object-[50%_30%]" />
                </div>
              </div>
            </div>
            <ol className={`grid content-start gap-4 sm:grid-cols-2 lg:col-span-7 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`} data-reveal="linea">
              {s.reglas.map((r, j) => (
                <li key={r.cuando}>
                  <Regla regla={r} tono="oscuro" numero={j + 1} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      <section data-tema="oscuro" className="oscuro" aria-labelledby="titulo-tu-caso">
        <div className="marco seccion grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-eyebrow text-amarillo">¿Y en tu negocio?</p>
            <h2 id="titulo-tu-caso" className="t-display mt-5" data-titular>
              Tu regla aún no está <span className="italica text-amarillo">en esta lista.</span>
            </h2>
            <p className="t-lead mt-6 max-w-xl text-crema/75" data-reveal>
              Cuéntanos qué tarea te gustaría no volver a hacer a mano y la buscamos juntos en el diagnóstico gratuito.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end" data-reveal>
            <Link href="/diagnostico" className="btn btn-amarillo">
              Pedir diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
            </Link>
            <Link href="/servicios" className="btn btn-claro">
              Ver servicios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
