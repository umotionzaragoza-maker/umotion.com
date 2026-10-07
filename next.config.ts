import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Orígenes externos que solo se usan si hay IDs configurados y el usuario acepta cookies.
const analyticsScript = ["https://www.googletagmanager.com", "https://connect.facebook.net"];
const analyticsConnect = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://www.facebook.com",
];
const analyticsImg = ["https://*.google-analytics.com", "https://*.googletagmanager.com", "https://www.facebook.com"];

/**
 * CSP sin nonces: mantiene todas las páginas estáticas y cacheables en CDN.
 * 'unsafe-inline' en script-src es necesario para la hidratación estática de Next;
 * el resto de directivas cierran orígenes, frames, formularios y objetos.
 * Ruta de endurecimiento con nonces documentada en docs/SEGURIDAD.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${analyticsScript.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${analyticsImg.join(" ")}`,
  "media-src 'none'",
  "font-src 'self'",
  `connect-src 'self' ${analyticsConnect.join(" ")}`,
  "frame-src https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
  async redirects() {
    // Umotion no tenía web: no hay URL antiguas. Solo alias habituales que la gente escribe o comparte.
    return [
      { source: "/diagnostico-gratis", destination: "/diagnostico", permanent: true },
      { source: "/diagnostico-gratuito", destination: "/diagnostico", permanent: true },
      { source: "/servicio", destination: "/servicios", permanent: true },
      { source: "/sobre-nosotros", destination: "/nosotros", permanent: true },
      { source: "/como-trabajamos", destination: "/metodo", permanent: true },
      { source: "/politica-privacidad", destination: "/privacidad", permanent: true },
      { source: "/politica-cookies", destination: "/cookies", permanent: true },
    ];
  },
};

export default nextConfig;
