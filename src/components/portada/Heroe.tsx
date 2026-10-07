import Link from "next/link";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { Icono } from "@/components/ui/Icono";
import { negocio } from "@/data/negocio";
import { PanelActividad } from "./PanelActividad";

/** Héroe claro: la promesa a la izquierda, la automatización funcionando a la derecha. */
export function Heroe() {
  return (
    <section
      data-tema="claro"
      className="relative isolate overflow-hidden bg-papel pt-[calc(var(--cabecera)+2.5rem)] pb-[calc(var(--barra-movil)+3.5rem)] md:pt-[calc(var(--cabecera)+4rem)] md:pb-24"
      aria-labelledby="titular-inicio"
    >
      <div className="rejilla-puntos absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" aria-hidden="true" />
      <div
        className="absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(53 200 255 / 0.28), rgb(43 82 240 / 0.08) 60%, transparent)" }}
        aria-hidden="true"
      />

      <div className="marco grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7" data-reveal="linea">
          <p className="t-etiqueta flex flex-wrap items-center gap-x-3 gap-y-2 text-gris">
            <span className="chip bg-tinta text-crema">
              <span className="size-1.5 rounded-full bg-amarillo" aria-hidden="true" />
              Digital + IA
            </span>
            <span>Para negocios de {negocio.zona.ciudad}</span>
          </p>

          <h1 id="titular-inicio" className="t-mega mt-7 max-w-[14ch] text-tinta">
            Más clientes, menos trabajo <span className="texto-marca">repetitivo.</span>
          </h1>

          <p className="t-lead mt-7 max-w-[36rem] text-gris">
            Webs, tiendas online y marketing para que te encuentren. Automatizaciones para que reservas, facturas y correos se
            hagan solos. Y un análisis de tu negocio para saber por dónde empezar. El primer paso, un diagnóstico gratuito.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/diagnostico" className="btn">
              Pide tu diagnóstico gratis
              <Icono nombre="flecha" className="flecha size-4" />
            </Link>
            <AccionContacto tipo="whatsapp" origen="portada-heroe" className="enlace text-tinta">
              <Icono nombre="whatsapp" className="size-4" />
              O escríbenos por WhatsApp
            </AccionContacto>
          </div>

          <dl className="mt-12 grid max-w-[36rem] grid-cols-2 gap-6 border-t border-tinta/10 pt-6 text-[0.9rem]">
            <div>
              <dt className="t-etiqueta text-gris">Dónde</dt>
              <dd className="mt-2 font-medium">En tu negocio o por videollamada</dd>
            </div>
            <div>
              <dt className="t-etiqueta text-gris">Ahora</dt>
              <dd className="mt-2 font-medium">
                <EstadoAbierto />
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5" data-reveal>
          <PanelActividad />
        </div>
      </div>
    </section>
  );
}
