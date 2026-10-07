import type { Metadata } from "next";
import { horario, negocio, SITE_URL } from "@/data/negocio";
import { servicios } from "@/data/servicios";

/** Recorta en la última palabra completa y añade «…» si el texto pasa de `max` caracteres. */
export function recortar(texto: string, max: number) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "")}…`;
}

type Opciones = {
  titulo: string;
  descripcion: string;
  ruta: string;
  imagen?: string;
  tipo?: "website" | "article";
  indexar?: boolean;
};

export function metadatos({ titulo, descripcion, ruta, imagen = `${SITE_URL}/opengraph-image`, tipo = "website", indexar = true }: Opciones): Metadata {
  const url = `${SITE_URL}${ruta}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    robots: indexar ? undefined : { index: false, follow: true },
    openGraph: {
      type: tipo,
      locale: "es_ES",
      siteName: negocio.nombreLegible,
      title: titulo,
      description: descripcion,
      url,
      ...(imagen ? { images: [{ url: imagen, width: 1200, height: 630, alt: titulo }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      ...(imagen ? { images: [imagen] } : {}),
    },
  };
}

/**
 * Umotion no tiene local abierto al público: se marca como servicio profesional con zona de servicio
 * (Zaragoza) y horario de atención, sin dirección postal (no hay local abierto al público).
 */
const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function negocioJsonLd() {
  const aperturas = Object.entries(horario).flatMap(([dia, tramos]) =>
    tramos.map(([a, c]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS_SCHEMA[Number(dia)], opens: hhmm(a), closes: hhmm(c) })),
  );
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#negocio`,
    name: negocio.nombreLegible,
    description: negocio.descripcionCorta,
    url: SITE_URL,
    telephone: negocio.telefono.e164,
    ...(negocio.email ? { email: negocio.email } : {}),
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/icon.svg`,
    areaServed: { "@type": "City", name: negocio.zona.ciudad, containedInPlace: { "@type": "AdministrativeArea", name: negocio.zona.region } },
    address: { "@type": "PostalAddress", addressLocality: negocio.zona.ciudad, addressRegion: negocio.zona.region, addressCountry: negocio.zona.pais },
    openingHoursSpecification: aperturas,
    knowsAbout: ["Automatización de procesos", "Diseño web", "Tiendas online", "Marketing digital", "Inteligencia artificial para empresas", "Consultoría y análisis de negocio"],
    ...(negocio.diagnosticoGratis
      ? {
          makesOffer: {
            "@type": "Offer",
            name: "Diagnóstico gratuito",
            price: "0",
            priceCurrency: "EUR",
            url: `${SITE_URL}/diagnostico`,
            itemOffered: { "@type": "Service", name: "Diagnóstico gratuito del negocio" },
          },
        }
      : {}),
    sameAs: Object.values(negocio.redes).filter(Boolean),
  };
}

/** Catálogo de servicios para /servicios (sin precios: salvo el diagnóstico, se presupuestan). */
export function serviciosJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: servicios.map((sv, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: sv.nombre,
        description: sv.descripcion,
        url: `${SITE_URL}/servicios#${sv.slug}`,
        provider: { "@id": `${SITE_URL}/#negocio` },
        areaServed: negocio.zona.ciudad,
        ...(sv.precio === "gratis" ? { offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } } : {}),
      },
    })),
  };
}

export function migasJsonLd(items: { nombre: string; ruta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nombre,
      item: `${SITE_URL}${it.ruta}`,
    })),
  };
}

export function faqJsonLd(preguntas: { p: string; r: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map(({ p, r }) => ({
      "@type": "Question",
      name: p,
      acceptedAnswer: { "@type": "Answer", text: r },
    })),
  };
}
