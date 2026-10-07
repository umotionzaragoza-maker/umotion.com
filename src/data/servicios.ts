/**
 * Servicios de Umotion. Fuente: el equipo (07/10/2026) confirma que vende automatizaciones, webs,
 * tiendas online, marketing digital, y consultoría y análisis del negocio. El primer diagnóstico es gratuito.
 * Los ejemplos describen tipos de trabajo habituales, no casos de clientes.
 * No hay precios publicados: `precio: "gratis"` solo para lo confirmado; el resto, «a consultar».
 */

export type FamiliaId = "analisis" | "presencia" | "automatizacion";
export type NombreIconoServicio =
  | "radar"
  | "plan"
  | "brujula"
  | "calendario"
  | "factura"
  | "mail"
  | "grafica"
  | "enlace"
  | "pantalla"
  | "tienda"
  | "megafono";

export type Servicio = {
  slug: string;
  familia: FamiliaId;
  nombre: string;
  titular: string;
  descripcion: string;
  ejemplos: string[];
  icono: NombreIconoServicio;
  precio: "gratis" | "consultar";
};

/** Tres familias, en el orden en que suele trabajar un negocio: entender, atraer clientes, quitar tareas. */
export const familias: { id: FamiliaId; nombre: string; corto: string; titular: string; texto: string }[] = [
  {
    id: "analisis",
    nombre: "Análisis y consultoría",
    corto: "Entender",
    titular: "Primero, entender.",
    texto: "Antes de proponer nada, miramos cómo funciona tu negocio. Sales sabiendo qué mejorar primero y por qué.",
  },
  {
    id: "presencia",
    nombre: "Webs, tiendas online y marketing",
    corto: "Atraer clientes",
    titular: "Que te encuentren, te elijan y te escriban.",
    texto: "Una web clara, una tienda que vende sola y un marketing con los pies en el suelo para que lleguen más clientes de tu zona.",
  },
  {
    id: "automatizacion",
    nombre: "Automatización de procesos",
    corto: "Quitar tareas",
    titular: "Después, que se haga solo.",
    texto: "Conectamos tus herramientas y automatizamos las tareas repetitivas para que el dato se escriba una vez y el resto ocurra solo.",
  },
];

export const servicios: Servicio[] = [
  {
    slug: "diagnostico-gratuito",
    familia: "analisis",
    nombre: "Diagnóstico gratuito",
    titular: "Una conversación de trabajo sobre tu negocio.",
    descripcion:
      "Nos cuentas cómo trabajas, en tu negocio o por videollamada, y vemos juntos qué te quita tiempo, qué te frena para conseguir clientes y por dónde empezar.",
    ejemplos: ["Qué tareas se repiten cada día", "Cómo te encuentran hoy tus clientes", "Qué merece la pena hacer primero"],
    icono: "radar",
    precio: "gratis",
  },
  {
    slug: "analisis-del-negocio",
    familia: "analisis",
    nombre: "Análisis del negocio",
    titular: "Saber dónde estás y qué mejorar primero.",
    descripcion:
      "Revisamos tus procesos, tus canales de venta y tus cifras para detectar qué frena el negocio y qué mejoras darían más resultado, ordenadas por prioridad.",
    ejemplos: ["Procesos y tiempos del día a día", "Ventas y canales de clientes", "Plan de mejoras con prioridades y precio"],
    icono: "plan",
    precio: "consultar",
  },
  {
    slug: "consultoria-digital-e-ia",
    familia: "analisis",
    nombre: "Consultoría digital e IA",
    titular: "Decidir con criterio qué herramientas usar.",
    descripcion:
      "Te ayudamos a elegir herramientas digitales y de inteligencia artificial, a usarlas con los datos de tu negocio y a encajarlas en tu forma de trabajar.",
    ejemplos: ["Elegir herramientas sin pagar de más", "Redactar, resumir y clasificar con IA", "Buenas prácticas con tus datos"],
    icono: "brujula",
    precio: "consultar",
  },
  {
    slug: "web-para-tu-negocio",
    familia: "presencia",
    nombre: "Web para tu negocio",
    titular: "Una web clara que trae contactos.",
    descripcion:
      "Diseñamos y publicamos la web de tu negocio: qué haces, para quién y cómo contactarte, pensada primero para el móvil y para que te encuentren en Google en tu zona.",
    ejemplos: ["Diseño adaptado al móvil", "Textos claros y formulario o WhatsApp", "Preparada para Google y medición de contactos"],
    icono: "pantalla",
    precio: "consultar",
  },
  {
    slug: "tienda-online",
    familia: "presencia",
    nombre: "Tienda online",
    titular: "Vender por internet sin complicarte.",
    descripcion:
      "Montamos tu tienda online con catálogo, pagos y envíos, y la conectamos con lo que ya usas para que pedidos y existencias no se lleven a mano.",
    ejemplos: ["Catálogo, pagos y envíos", "Avisos de pedidos y existencias", "Fácil de actualizar por ti"],
    icono: "tienda",
    precio: "consultar",
  },
  {
    slug: "marketing-digital",
    familia: "presencia",
    nombre: "Marketing digital",
    titular: "Que más gente de tu zona te conozca.",
    descripcion:
      "Planificamos y llevamos tu presencia en Google y redes sociales, con contenidos y campañas pensados para tu cliente y midiendo qué trae contactos de verdad.",
    ejemplos: ["Plan de contenidos y redes sociales", "Campañas en Google y redes", "Medición de contactos y ventas"],
    icono: "megafono",
    precio: "consultar",
  },
  {
    slug: "pedidos-reservas-y-citas",
    familia: "automatizacion",
    nombre: "Pedidos, reservas y citas",
    titular: "Que lleguen ordenados, no apuntados a mano.",
    descripcion:
      "Los pedidos, reservas o citas que entran por WhatsApp, la web o un formulario se anotan solos en tu agenda u hoja, con confirmación y recordatorio para el cliente.",
    ejemplos: ["Registro automático en hoja o agenda", "Confirmación al cliente", "Recordatorios antes de la cita"],
    icono: "calendario",
    precio: "consultar",
  },
  {
    slug: "facturas-y-administracion",
    familia: "automatizacion",
    nombre: "Facturas y administración",
    titular: "Menos papeleo, más orden.",
    descripcion:
      "Facturas y albaranes que se ordenan solos, datos que pasan de un documento a una hoja sin teclearlos y avisos de cobros y vencimientos a tiempo.",
    ejemplos: ["Extraer datos de facturas", "Todo listo para tu gestoría", "Avisos de vencimientos"],
    icono: "factura",
    precio: "consultar",
  },
  {
    slug: "correo-y-atencion",
    familia: "automatizacion",
    nombre: "Correo y atención al cliente",
    titular: "Responder antes, sin escribir lo mismo cada día.",
    descripcion:
      "Clasificación del correo, respuestas a las preguntas de siempre y borradores preparados con IA que tú revisas y envías.",
    ejemplos: ["Clasificar y etiquetar correos", "Borradores de respuesta con IA", "Plantillas para lo repetido"],
    icono: "mail",
    precio: "consultar",
  },
  {
    slug: "informes-y-avisos",
    familia: "automatizacion",
    nombre: "Informes y avisos",
    titular: "Tus cifras, sin buscarlas.",
    descripcion:
      "Un resumen de ventas, reservas o existencias que llega solo a tu móvil o a tu correo, y avisos cuando algo necesita tu atención.",
    ejemplos: ["Resumen diario o semanal", "Aviso de existencias bajas", "Cuadros de mando sencillos"],
    icono: "grafica",
    precio: "consultar",
  },
  {
    slug: "conectar-herramientas",
    familia: "automatizacion",
    nombre: "Conectar tus herramientas",
    titular: "Que tus programas se hablen entre ellos.",
    descripcion:
      "Tienda online, hoja de cálculo, calendario, correo o gestión de clientes: los conectamos para que un dato se escriba una vez y llegue a todas partes.",
    ejemplos: ["Sin copiar y pegar entre programas", "Datos al día en todas partes", "Menos errores al teclear"],
    icono: "enlace",
    precio: "consultar",
  },
];

export const serviciosDe = (f: FamiliaId) => servicios.filter((s) => s.familia === f);
export const servicioPorSlug = (slug: string) => servicios.find((s) => s.slug === slug);
