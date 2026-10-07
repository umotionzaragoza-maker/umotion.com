import { imagenOG, tamanoOG } from "@/lib/og";

export const alt = "Umotion · Webs, marketing y automatización con IA en Zaragoza";
export const size = tamanoOG;
export const contentType = "image/png";

export default function Image() {
  return imagenOG({ antetitulo: "Webs · Marketing · Automatización con IA", titulo: "Más clientes, menos trabajo", remate: "repetitivo." });
}
