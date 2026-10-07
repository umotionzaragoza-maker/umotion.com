import type { FotoKey } from "@/lib/fotos";

/**
 * Procedencia de cada imagen. Hoy todas son ilustraciones de marca (scripts/imagenes/) con los colores
 * del logotipo: no son fotografías ni muestran clientes, personas ni trabajos reales.
 * Si se añaden fotos reales, tipo "real" con su autor.
 */
export type Credito = {
  tipo: "ilustracion" | "real";
  autor: string;
  fuente: string;
  licencia: string;
  descripcion: string;
};

const propia = (descripcion: string): Credito => ({
  tipo: "ilustracion",
  autor: "Umotion",
  fuente: "Ilustración de marca",
  licencia: "Uso exclusivo de Umotion",
  descripcion,
});

export const creditos: Record<FotoKey, Credito> = {
  heroe: propia("Haz de luz que sube, como la flecha del logotipo"),
  flujo: propia("Esquema de una automatización en cuatro pasos"),
  marca: propia("La U del logotipo hecha de filamentos de luz"),
  metodo: propia("Los cuatro pasos del método"),
  diagnostico: propia("Radar: el diagnóstico encuentra dónde se pierde tiempo"),
  visita: propia("Ruta de luz hasta tu negocio"),
  sectorHosteleria: propia("Hostelería: taza de café en trazo de luz"),
  sectorComercio: propia("Comercio: bolsa con etiqueta en trazo de luz"),
  sectorProfesionales: propia("Profesionales: documento revisado en trazo de luz"),
  sectorPymes: propia("Pymes: gráfico que crece en trazo de luz"),
};
