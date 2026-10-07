import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/negocio";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const paginas: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/diagnostico", 0.9, "monthly"],
    ["/servicios", 0.9, "monthly"],
    ["/ejemplos", 0.8, "monthly"],
    ["/metodo", 0.7, "monthly"],
    ["/nosotros", 0.6, "monthly"],
    ["/contacto", 0.8, "monthly"],
  ];
  return paginas.map(([ruta, priority, changeFrequency]) => ({ url: `${SITE_URL}${ruta}`, lastModified: ahora, changeFrequency, priority }));
}
