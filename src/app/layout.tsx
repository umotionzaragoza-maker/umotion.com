import { Analytics as AnaliticaVercel } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analitica } from "@/components/cookies/Analitica";
import { BannerCookies } from "@/components/cookies/BannerCookies";
import { BarraMovil } from "@/components/layout/BarraMovil";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";
import { EtiquetaCursor } from "@/components/motion/EtiquetaCursor";
import { Movimiento } from "@/components/motion/Movimiento";
import { JsonLd } from "@/components/seo/JsonLd";
import { negocio, SITE_URL } from "@/data/negocio";
import { negocioJsonLd } from "@/lib/seo";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

// Mono para la capa «sistema» (registro de actividad, horas, reglas). Autoalojada, un solo peso.
const mono = localFont({
  src: "../assets/fuentes/geist-mono-500.woff2",
  weight: "500",
  variable: "--font-mono-sistema",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Umotion · Webs, marketing y automatización con IA en Zaragoza",
    template: "%s · Umotion",
  },
  description:
    "Webs, tiendas online, marketing digital y automatización con IA para negocios de Zaragoza. Diagnóstico gratuito en tu negocio o por videollamada.",
  applicationName: negocio.nombreLegible,
  keywords: [
    "Umotion",
    "Umotion Zaragoza",
    "automatización de procesos Zaragoza",
    "inteligencia artificial para empresas Zaragoza",
    "automatizar negocio",
    "IA para pymes",
    "consultoría IA Zaragoza",
    "diagnóstico gratuito automatización",
    "diseño web Zaragoza",
    "tienda online Zaragoza",
    "marketing digital Zaragoza",
  ],
  authors: [{ name: negocio.nombreLegible }],
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: negocio.nombreLegible,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#080a14",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Se ejecuta antes de pintar: activa las animaciones de entrada solo si hay JS y no se
// ha pedido reducir movimiento. Si el motor no arranca en 3,5 s, se muestra todo igualmente.
const scriptMovimiento = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('movimiento');setTimeout(function(){if(!window.__movimientoListo){d.classList.remove('movimiento')}},3500)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${instrument.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptMovimiento }} />
      </head>
      <body>
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-amarillo px-5 py-3 font-semibold text-tinta transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Movimiento>
          <Cabecera />
          <main id="contenido" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Pie />
          <BarraMovil />
          <EtiquetaCursor />
        </Movimiento>
        <BannerCookies />
        <Analitica />
        {/* Visitas sin cookies: solo existe en Vercel (VERCEL=1 al compilar allí); en local no se carga. */}
        {process.env.VERCEL && <AnaliticaVercel />}
        <JsonLd data={negocioJsonLd()} />
      </body>
    </html>
  );
}
