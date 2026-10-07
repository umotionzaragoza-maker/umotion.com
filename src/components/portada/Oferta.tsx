import Link from "next/link";
import type { ReactNode } from "react";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { negocio } from "@/data/negocio";

/** 03 — La oferta: el diagnóstico gratuito y las tres formas de pedirlo, en un solo bloque. */
export function Oferta() {
  return (
    <section data-tema="oscuro" className="oscuro relative isolate overflow-hidden" aria-labelledby="titulo-oferta">
      <div className="rejilla-puntos-oscura absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div
        className="absolute -bottom-60 -left-40 -z-10 size-[44rem] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(43 82 240 / 0.35), transparent)" }}
        aria-hidden="true"
      />
      <div className="marco seccion grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="t-etiqueta text-amarillo">04 · El primer paso</p>
          <h2 id="titulo-oferta" className="t-mega mt-6">
            Tu diagnóstico, <span className="texto-marca">gratis.</span>
          </h2>
          <p className="t-lead mt-8 max-w-xl text-crema/70">
            Una conversación de trabajo sobre tu negocio, en tu local o por videollamada. Vemos cómo trabajas y te decimos qué
            mejorar y por dónde empezar. Sin coste y sin compromiso.
          </p>
          <ul className="mt-10 space-y-3 text-[0.97rem] text-crema/80">
            {["Sabes qué mejorar primero y qué no hace falta", "Precio claro antes de empezar nada", "No necesitas saber de tecnología"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Icono nombre="check" className="size-4 text-amarillo" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:pt-14">
          <p className="t-etiqueta text-gris-claro">Elige cómo pedirlo</p>
          <ul className="mt-5 border-t border-crema/10">
            <Fila
              icono="plan"
              titulo="Rellena el formulario"
              texto="Un minuto. Nos cuentas tu negocio y qué te quita tiempo."
              etiqueta="Recomendado"
              accion={
                <Link href="/diagnostico" className="absolute inset-0" aria-label="Pedir el diagnóstico con el formulario" />
              }
            />
            <Fila
              icono="whatsapp"
              titulo="Escríbenos por WhatsApp"
              texto={`Al ${negocio.telefono.visible}. Te respondemos para quedar.`}
              accion={
                <AccionContacto tipo="whatsapp" origen="portada-oferta" className="absolute inset-0" aria-label="Escribir por WhatsApp">
                  <span className="sr-only">WhatsApp</span>
                </AccionContacto>
              }
            />
            <Fila
              icono="telefono"
              titulo="Llámanos"
              texto="Si lo tuyo es hablar. Lunes a sábado, de 9:00 a 20:00."
              accion={
                <AccionContacto tipo="llamar" origen="portada-oferta" className="absolute inset-0" aria-label={`Llamar al ${negocio.telefono.visible}`}>
                  <span className="sr-only">Llamar</span>
                </AccionContacto>
              }
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function Fila({
  icono,
  titulo,
  texto,
  etiqueta,
  accion,
}: {
  icono: NombreIcono;
  titulo: string;
  texto: string;
  etiqueta?: string;
  accion: ReactNode;
}) {
  return (
    <li className="group relative flex items-center gap-5 border-b border-crema/10 py-6 transition-colors hover:bg-crema/[0.03] sm:px-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-crema/[0.07] text-amarillo transition-colors group-hover:bg-amarillo group-hover:text-tinta">
        <Icono nombre={icono} className="size-5" />
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-3 text-lg font-semibold">
          {titulo}
          {etiqueta && <span className="chip t-etiqueta bg-amarillo/15 text-amarillo">{etiqueta}</span>}
        </span>
        <span className="mt-1 block text-[0.93rem] text-crema/60">{texto}</span>
      </span>
      <Icono nombre="flecha" className="size-5 shrink-0 text-crema/50 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-amarillo" />
      {accion}
    </li>
  );
}
