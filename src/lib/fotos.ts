import type { StaticImageData } from "next/image";

import diagnostico from "@/assets/fotos/diagnostico.jpg";
import flujo from "@/assets/fotos/flujo.jpg";
import heroe from "@/assets/fotos/heroe.jpg";
import marca from "@/assets/fotos/marca.jpg";
import metodo from "@/assets/fotos/metodo.jpg";
import sectorComercio from "@/assets/fotos/sector-comercio.jpg";
import sectorHosteleria from "@/assets/fotos/sector-hosteleria.jpg";
import sectorProfesionales from "@/assets/fotos/sector-profesionales.jpg";
import sectorPymes from "@/assets/fotos/sector-pymes.jpg";
import visita from "@/assets/fotos/visita.jpg";

/**
 * Ilustraciones de la marca (scripts/imagenes/). Un import por imagen:
 * Next calcula tamaño y desenfoque de carga en el build.
 */
export const fotos = {
  heroe,
  flujo,
  marca,
  metodo,
  diagnostico,
  visita,
  sectorHosteleria,
  sectorComercio,
  sectorProfesionales,
  sectorPymes,
} satisfies Record<string, StaticImageData>;

export type FotoKey = keyof typeof fotos;
