import type { Metadata } from "next";
import Link from "next/link";
import { FormularioContacto } from "@/components/contacto/FormularioContacto";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { Icono } from "@/components/ui/Icono";
import { horarioLegible, negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Contacto: WhatsApp, teléfono y videollamada",
  descripcion: `Habla con Umotion por WhatsApp o teléfono (${negocio.telefono.visible}) o en ${negocio.email}. Atendemos de lunes a sábado en Zaragoza.`,
  ruta: "/contacto",
});

const tarjeta = "group flex h-full flex-col justify-between gap-10 rounded-3xl p-7 transition-colors md:p-8";

export default function Contacto() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Contacto"
        titulo={
          <>
            Hablemos. <span className="italica text-amarillo">Como prefieras.</span>
          </>
        }
        entradilla="Lo más rápido es WhatsApp. Si quieres que miremos tu caso con calma, pide el diagnóstico gratuito."
        migas={[{ nombre: "Contacto", ruta: "/contacto" }]}
      >
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          <li>
            <AccionContacto
              tipo="whatsapp"
              origen="contacto"
              className={`${tarjeta} bg-tinta text-crema shadow-[0_30px_60px_-30px_rgb(43_82_240/0.55)] hover:bg-carbon`}
            >
              <span className="flex items-center justify-between">
                <span className="grid size-[52px] place-items-center rounded-2xl bg-amarillo text-tinta">
                  <Icono nombre="whatsapp" className="size-6" />
                </span>
                <span className="t-etiqueta text-amarillo">La más rápida</span>
              </span>
              <span>
                <span className="t-h3 block">WhatsApp</span>
                <span className="mt-1.5 block text-crema/70">Dudas, ideas y para quedar.</span>
                <span className="t-mono mt-4 block text-amarillo">{negocio.telefono.visible} →</span>
              </span>
            </AccionContacto>
          </li>
          <li>
            <AccionContacto tipo="llamar" origen="contacto" className={`${tarjeta} bg-crema text-tinta ring-1 ring-tinta/10 hover:ring-tinta/30`}>
              <span className="grid size-[52px] place-items-center rounded-2xl bg-tinta text-amarillo">
                <Icono nombre="telefono" className="size-6" />
              </span>
              <span>
                <span className="t-h3 block">Teléfono</span>
                <span className="mt-1.5 block text-gris">De lunes a sábado, de 9:00 a 20:00.</span>
                <span className="t-mono mt-4 block text-amarillo-hondo">{negocio.telefono.visible} →</span>
              </span>
            </AccionContacto>
          </li>
          <li>
            <AccionContacto tipo="email" origen="contacto" className={`${tarjeta} bg-crema text-tinta ring-1 ring-tinta/10 hover:ring-tinta/30`}>
              <span className="grid size-[52px] place-items-center rounded-2xl bg-tinta text-amarillo">
                <Icono nombre="mail" className="size-6" />
              </span>
              <span>
                <span className="t-h3 block">Correo</span>
                <span className="mt-1.5 block text-gris">Para lo que no corre prisa.</span>
                <span className="t-mono mt-4 block break-all text-amarillo-hondo">{negocio.email} →</span>
              </span>
            </AccionContacto>
          </li>
        </ul>
      </CabeceraPagina>

      <section data-tema="claro" className="bg-papel" aria-labelledby="titulo-formulario">
        <div className="marco grid gap-4 pb-[var(--seccion)] lg:grid-cols-12">
          <div className="rounded-3xl bg-crema p-6 ring-1 ring-tinta/10 md:p-10 lg:col-span-7">
            <p className="t-etiqueta text-amarillo-hondo">Escríbenos aquí</p>
            <h2 id="titulo-formulario" className="t-h2 mb-8 mt-4">
              Un mensaje y te respondemos.
            </h2>
            <FormularioContacto />
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <div id="donde" className="rounded-3xl p-7 ring-1 ring-tinta/10 md:p-8">
              <p className="t-etiqueta text-gris">Horario de atención</p>
              <dl className="mt-4 grid gap-2.5 text-[1.05rem]">
                {horarioLegible.map((h) => (
                  <div key={h.dias} className="flex justify-between gap-4">
                    <dt>{h.dias}</dt>
                    <dd className="t-mono">{h.horas}</dd>
                  </div>
                ))}
              </dl>
              <EstadoAbierto variante="largo" className="mt-5 text-sm font-medium" />
            </div>
            <div className="panel rejilla-puntos-oscura flex flex-col p-7 md:p-8">
              <p className="t-etiqueta text-amarillo">Dónde</p>
              <p className="t-h3 mt-4">Sin oficina. Vamos a tu negocio, en {negocio.zona.ciudad}.</p>
              <p className="mt-3 text-crema/65">O por videollamada, estés donde estés.</p>
              <Link href="/diagnostico" className="btn btn-amarillo mt-8 self-start">
                Pide tu diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
