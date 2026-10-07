"use client";

import Script from "next/script";
import { useConsentimiento } from "@/lib/consent";

const GTM = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const GA4 = process.env.NEXT_PUBLIC_GA4_ID?.trim();
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

// Solo formatos válidos: evita inyectar valores arbitrarios desde la configuración.
const valido = {
  gtm: GTM && /^GTM-[A-Z0-9]{4,12}$/.test(GTM) ? GTM : null,
  ga4: GA4 && /^G-[A-Z0-9]{4,16}$/.test(GA4) ? GA4 : null,
  pixel: PIXEL && /^\d{8,20}$/.test(PIXEL) ? PIXEL : null,
};

/**
 * Carga GTM (preferente) o GA4 directo, y Meta Pixel, SOLO tras el consentimiento.
 * Sin IDs configurados no se carga nada. Eventos: src/lib/analytics.ts.
 */
export function Analitica() {
  const { valor } = useConsentimiento();
  if (!valor) return null;

  return (
    <>
      {valor.analitica && valido.gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${valido.gtm}');`}
        </Script>
      )}
      {valor.analitica && !valido.gtm && valido.ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${valido.ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${valido.ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {valor.marketing && valido.pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${valido.pixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
