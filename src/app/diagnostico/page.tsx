import type { Metadata } from "next";
import { FormularioDiagnostico } from "@/components/diagnostico/FormularioDiagnostico";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Diagnóstico gratuito para tu negocio",
  descripcion:
    "Pide tu diagnóstico gratuito: vemos cómo trabaja tu negocio, cómo te llegan los clientes y qué mejorar primero. En Zaragoza o por videollamada.",
  ruta: "/diagnostico",
});


export default function Diagnostico() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Diagnóstico gratuito"
        titulo={
          <>
            Cuéntanos tu negocio. <span className="italica text-amarillo">Te decimos por dónde empezar.</span>
          </>
        }
        entradilla="Un minuto. Al enviarlo se abre tu WhatsApp con la solicitud ya escrita: solo tienes que pulsar enviar. Gratis y sin compromiso."
        migas={[{ nombre: "Diagnóstico gratuito", ruta: "/diagnostico" }]}
        foto="diagnostico"
      />

      <section data-tema="claro" className="bg-papel" aria-labelledby="titulo-solicitud">
        <div className="marco pb-[var(--seccion)]">
          <h2 id="titulo-solicitud" className="sr-only">
            Solicitud de diagnóstico
          </h2>
          <FormularioDiagnostico />
        </div>
      </section>
    </>
  );
}
