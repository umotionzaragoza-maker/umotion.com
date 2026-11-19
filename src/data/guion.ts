/**
 * Guion de la portada cinemática. Cada capítulo es una pantalla de la portada y una forma del haz de fibras.
 * El guion completo, con la intención de cada escena y lo que falta, está en docs/GUION-WEB.md.
 *
 * Para añadir un capítulo: añade un objeto aquí con una `escena` existente (o crea una nueva en
 * src/components/cinematica/escenas.ts) y, si necesita contenido propio, un `bloque` nuevo en
 * src/components/cinematica/Bloques.tsx. El contador (001 / 00N) y la navegación se recalculan solos.
 *
 * Solo se afirma lo confirmado por Umotion: los textos de servicios, sectores, método y preguntas salen de sus
 * propios archivos de datos, que llevan su fuente.
 */

import type { EscenaId } from "@/components/cinematica/escenas";

/** Línea del titular: `cursiva` va en minúscula y cursiva delante del resto; `barras` añade «//». */
export type LineaTitular = { texto: string; cursiva?: string; barras?: boolean };

export type BloqueId = "inicio" | "problema" | "presencia" | "automatizacion" | "analisis" | "cierre";

export type Capitulo = {
  id: string;
  /** Nombre corto para la navegación lateral. */
  nombre: string;
  escena: EscenaId;
  /** Dónde va el texto; la escena se desplaza al lado contrario en pantallas anchas. */
  lado: "izquierda" | "derecha";
  etiqueta: string;
  titular: LineaTitular[];
  texto: string;
  bloque: BloqueId;
};

export const capitulos: Capitulo[] = [
  {
    id: "inicio",
    nombre: "Inicio",
    escena: "fibras",
    lado: "izquierda",
    etiqueta: "Umotion · Webs, marketing e IA para negocios",
    titular: [{ texto: "Más clientes," }, { cursiva: "menos", texto: "trabajo" }, { texto: "repetitivo", barras: true }],
    texto:
      "Webs que traen contactos, marketing que te hace visible y automatizaciones con inteligencia artificial que hacen solas las tareas de siempre. Para dueños de negocios que no tienen tiempo de pelearse con la tecnología.",
    bloque: "inicio",
  },
  {
    id: "problema",
    nombre: "El día a día",
    escena: "enredo",
    lado: "izquierda",
    etiqueta: "El día a día",
    titular: [{ texto: "Tu día se va" }, { cursiva: "en lo que", texto: "" }, { texto: "no vende", barras: true }],
    texto:
      "Coger el teléfono en plena hora punta. Apuntar reservas a mano. Buscar la factura que pide la gestoría. Responder por quinta vez la misma pregunta. Nada de eso es tu negocio, pero se come tus horas.",
    bloque: "problema",
  },
  {
    id: "presencia",
    nombre: "Que te vean",
    escena: "iris",
    lado: "izquierda",
    etiqueta: "Webs, tiendas online y marketing",
    titular: [{ texto: "Que te vean," }, { cursiva: "que te", texto: "elijan" }, { texto: "y te escriban", barras: true }],
    texto:
      "Una web clara, una tienda que vende sola y un marketing con los pies en el suelo para que lleguen más clientes de tu zona.",
    bloque: "presencia",
  },
  {
    id: "automatizacion",
    nombre: "Que se haga solo",
    escena: "onda",
    lado: "izquierda",
    etiqueta: "Automatización con IA",
    titular: [{ texto: "Que se haga" }, { cursiva: "solo", texto: "", barras: true }],
    texto:
      "Conectamos tus herramientas y automatizamos las tareas repetitivas para que el dato se escriba una vez y el resto ocurra solo. Elige tu tipo de negocio:",
    bloque: "automatizacion",
  },
  {
    id: "entender",
    nombre: "Primero, entender",
    escena: "red",
    lado: "derecha",
    etiqueta: "Análisis y consultoría",
    titular: [{ texto: "Primero," }, { cursiva: "entender", texto: "", barras: true }],
    texto: "Antes de proponer nada, miramos cómo funciona tu negocio. Sales sabiendo qué mejorar primero y por qué.",
    bloque: "analisis",
  },
  {
    id: "empezar",
    nombre: "Empezar",
    escena: "u",
    lado: "izquierda",
    etiqueta: "Cómo empezamos",
    titular: [{ texto: "El primer paso" }, { cursiva: "es", texto: "" }, { texto: "gratis", barras: true }],
    texto:
      "Una conversación de trabajo en tu negocio o por videollamada. Nos cuentas cómo trabajas y te decimos qué mejorar y por dónde empezaríamos. Sin coste.",
    bloque: "cierre",
  },
];

/** Escenas del capítulo «El día a día»: una por tipo de negocio de sectores.ts. */
export const problemas = [
  { sector: "Hostelería", texto: "Reservas por WhatsApp que alguien tiene que apuntar." },
  { sector: "Comercio", texto: "Encargos y existencias que se controlan de memoria." },
  { sector: "Profesionales", texto: "Citas, correos y documentos que se ordenan a mano." },
  { sector: "Pymes", texto: "Contactos, presupuestos y datos que el equipo copia de un programa a otro." },
] as const;

export const remateProblema = "Y mientras tanto, quien te busca desde el móvil puede acabar en el negocio de al lado.";

/** Preguntas de faq.ts que se responden en el cierre (por su texto exacto). */
export const dudasCierre = [
  "¿Necesito saber de tecnología o de inteligencia artificial?",
  "¿Tengo que cambiar los programas que ya uso?",
  "¿Cuánto cuestan vuestros servicios?",
] as const;
