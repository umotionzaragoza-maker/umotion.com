import type { Metadata } from "next";
import { Portada } from "@/components/cinematica/Portada";
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

/** Portada cinemática (v3). Guion en docs/GUION-WEB.md; textos en src/data/guion.ts. */
export default function Inicio() {
  return (
    <>
      <Portada />
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
