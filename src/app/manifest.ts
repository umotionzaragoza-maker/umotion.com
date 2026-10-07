import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Umotion · Webs, marketing y automatización con IA",
    short_name: "Umotion",
    description: "Webs, tiendas online, marketing digital y automatización con IA para negocios de Zaragoza. Diagnóstico gratuito en tu negocio o por videollamada.",
    start_url: "/",
    display: "standalone",
    background_color: "#080a14",
    theme_color: "#080a14",
    lang: "es",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
