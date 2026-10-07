/**
 * Cómo trabaja Umotion, en cuatro pasos. El paso 1 (diagnóstico gratuito, en el negocio o por
 * videollamada) está confirmado por el cliente; el detalle de los pasos 2–4 es la forma de trabajo
 * propuesta y está pendiente de su confirmación (docs/PENDIENTES.md).
 */
export const pasos = [
  {
    titulo: "Diagnóstico gratuito",
    texto: "Hablamos contigo en tu negocio o por videollamada. Nos enseñas cómo trabajas y localizamos juntos las tareas que se repiten.",
    resultado: "Sabes qué se puede automatizar y qué no.",
  },
  {
    titulo: "Propuesta",
    texto: "Te proponemos qué automatizar primero, con qué herramientas y cuánto cuesta. Con eso delante, decides si seguimos.",
    resultado: "Precio y alcance claros antes de empezar.",
  },
  {
    titulo: "Puesta en marcha",
    texto: "Montamos las automatizaciones, las probamos con casos reales de tu negocio y te enseñamos a usarlas.",
    resultado: "Probado con tus casos reales.",
  },
  {
    titulo: "Seguimiento",
    texto: "Comprobamos que todo va bien, ajustamos lo que haga falta y, cuando quieras, pasamos a la siguiente tarea.",
    resultado: "Tu negocio sigue mejorando paso a paso.",
  },
] as const;

/** Principios de trabajo (a confirmar por el cliente, ver docs/PENDIENTES.md). */
export const pilares = [
  {
    titulo: "Primero, entender",
    texto: "Antes de proponer nada, miramos cómo trabajas: qué se repite, qué se olvida y dónde se pierde el tiempo.",
  },
  {
    titulo: "Con lo que ya usas",
    texto: "WhatsApp, correo, hojas de cálculo o tu programa de gestión. Siempre que se puede, partimos de ahí.",
  },
  {
    titulo: "Paso a paso",
    texto: "Empezamos por lo que más tiempo libera. Una automatización cada vez, probada con casos reales de tu negocio.",
  },
  {
    titulo: "Tú decides",
    texto: "Te explicamos cada automatización en claro y nada se pone en marcha sin tu visto bueno.",
  },
];
