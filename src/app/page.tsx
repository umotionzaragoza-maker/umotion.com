import type { Metadata } from "next";
import { Cercania } from "@/components/portada/Cercania";
import { Configurador } from "@/components/portada/Configurador";
import { Heroe } from "@/components/portada/Heroe";
import { Oferta } from "@/components/portada/Oferta";
import { Pasos } from "@/components/portada/Pasos";
import { QueHacemos } from "@/components/portada/QueHacemos";
import { JsonLd } from "@/components/seo/JsonLd";
import { faq } from "@/data/faq";
import { faqJsonLd, metadatos } from "@/lib/seo";

export const metadata: Metadata = {
  ...metadatos({
    titulo: "Umotion · Webs, marketing y automatización con IA en Zaragoza",
    descripcion:
      "Webs, tiendas online, marketing digital y automatización con IA para negocios de Zaragoza. Diagnóstico gratuito en tu negocio o por videollamada.",
    ruta: "/",
  }),
  title: { absolute: "Umotion · Webs, marketing y automatización con IA en Zaragoza" },
};

export default function Inicio() {
  return (
    <>
      <Heroe />
      <QueHacemos />
      <Configurador />
      <Pasos />
      <Oferta />
      <Cercania />
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
