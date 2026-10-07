import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Acordeon } from "@/components/ui/Acordeon";
import { Icono } from "@/components/ui/Icono";
import { faq } from "@/data/faq";
import { pasos, pilares } from "@/data/metodo";
import { fotos } from "@/lib/fotos";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Cómo trabajamos: del diagnóstico a la automatización",
  descripcion:
    "Diagnóstico gratuito, propuesta con precio claro, puesta en marcha y seguimiento. Así automatizamos las tareas de tu negocio, una a una.",
  ruta: "/metodo",
});

const necesitamos = [
  { titulo: "Un rato de tu tiempo", texto: "Para el diagnóstico: nos enseñas cómo trabajas en un día normal." },
  { titulo: "Acceso a tus herramientas", texto: "Solo a las que intervienen en cada automatización, y con tu permiso." },
  { titulo: "Una persona de referencia", texto: "Quien conoce la tarea y puede decirnos si el resultado le sirve." },
];

export default function MetodoPagina() {
  const preguntas = faq.filter((f) => /cuesta|programas|datos|tecnología/.test(f.p));
  return (
    <>
      <CabeceraPagina
        eyebrow="Cómo trabajamos"
        titulo={
          <>
            Paso a paso, <span className="italica text-amarillo">y tú decides cada uno.</span>
          </>
        }
        entradilla="Nada de proyectos eternos ni de tecnología por la tecnología. Empezamos entendiendo tu negocio y automatizamos primero lo que más tiempo te devuelve."
        migas={[{ nombre: "Cómo trabajamos", ruta: "/metodo" }]}
        foto="heroe"
      />

      {/* Los cuatro pasos */}
      <section data-tema="claro" className="bg-papel" aria-labelledby="titulo-pasos">
        <div className="marco seccion">
          <h2 id="titulo-pasos" className="sr-only">
            Los cuatro pasos
          </h2>
          <ol className="divide-y divide-tinta/10 border-y border-tinta/10">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="grid gap-6 py-12 md:grid-cols-12 md:gap-10 md:py-16" data-reveal>
                <p className="t-num font-display text-[4.5rem] font-medium leading-none tracking-[-0.06em] text-amarillo-hondo md:col-span-2 md:text-[6rem]" aria-hidden="true">
                  0{i + 1}
                </p>
                <div className="md:col-span-5">
                  <h3 className="t-h1">{p.titulo}</h3>
                  {i === 0 && <p className="mt-4 inline-flex rounded-full bg-tinta px-4 py-1.5 text-sm font-semibold text-amarillo">Gratis</p>}
                </div>
                <div className="md:col-span-5">
                  <p className="t-lead text-gris">{p.texto}</p>
                  <p className="mt-5 flex items-start gap-2 font-semibold">
                    <Icono nombre="check" className="mt-1 size-5 shrink-0 text-amarillo-hondo" /> {p.resultado}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Principios */}
      <section data-tema="oscuro" className="relative bg-noche text-papel" aria-labelledby="titulo-principios">
        <div className="marco seccion grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-eyebrow text-amarillo">Lo que no cambia</p>
            <h2 id="titulo-principios" className="t-display mt-5" data-titular>
              Tecnología al servicio <span className="italica text-amarillo">de tu forma de trabajar.</span>
            </h2>
            <div data-mascara className="foto relative mt-10 aspect-[4/5] max-w-md overflow-hidden rounded-[1.75rem]">
              <Image
                src={fotos.metodo}
                alt="Ilustración de los cuatro pasos: diagnóstico, propuesta, puesta en marcha y seguimiento"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          <ul className="grid content-start gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7" data-reveal="linea">
            {pilares.map((p, i) => (
              <li key={p.titulo} className="border-t border-papel/15 pt-6">
                <span className="t-num italica block text-[3rem] leading-none text-amarillo" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="t-h3 mt-5">{p.titulo}</h3>
                <p className="mt-3 text-papel/70">{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qué necesitamos */}
      <section data-tema="claro" className="bg-hueso" aria-labelledby="titulo-necesitamos">
        <div className="marco seccion">
          <div className="max-w-3xl">
            <p className="t-eyebrow text-gris">Para empezar</p>
            <h2 id="titulo-necesitamos" className="t-h1 mt-5" data-titular>
              Lo que necesitamos <span className="italica text-amarillo-hondo">de ti.</span>
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3" data-reveal="linea">
            {necesitamos.map((n, i) => (
              <li key={n.titulo} className="rounded-[1.5rem] bg-crema p-7 ring-1 ring-tinta/10">
                <span className="t-num text-sm text-gris">0{i + 1}</span>
                <h3 className="t-h3 mt-6">{n.titulo}</h3>
                <p className="mt-3 text-gris">{n.texto}</p>
              </li>
            ))}
          </ul>

          <div className="mt-[calc(var(--seccion)*0.7)] grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="t-eyebrow text-gris">Dudas habituales</p>
              <h2 className="t-h1 mt-4">Antes de dar el paso</h2>
              <Link href="/diagnostico" className="btn mt-8">
                Pedir diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
              </Link>
            </div>
            <div className="lg:col-span-8">
              <Acordeon items={preguntas} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
