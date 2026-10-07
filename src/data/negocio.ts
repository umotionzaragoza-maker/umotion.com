/**
 * Datos del negocio. Fuente única de verdad para toda la web.
 * Cada dato lleva su fuente (ver docs/INVESTIGACION.md). Umotion no tiene todavía presencia pública
 * (ni web, ni redes, ni ficha de Google): todo lo que hay aquí lo ha confirmado el cliente
 * (encargo del 30/09/2026). Lo que falta está en docs/PENDIENTES.md y NO se inventa.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://umotion.es").replace(/\/$/, "");

export const negocio = {
  nombre: "Umotion", // Fuente: cliente y logotipo
  nombreLegible: "Umotion",
  descripcionCorta:
    "Webs, tiendas online, marketing digital, automatización de procesos y consultoría con IA para comercios, hostelería, profesionales y pymes de Zaragoza. Primer diagnóstico gratuito.",

  /** Sin oficina abierta al público: se atiende en el negocio del cliente, por videollamada o por WhatsApp/teléfono. */
  zona: {
    ciudad: "Zaragoza",
    region: "Aragón",
    pais: "ES",
    // Fuente: cliente. Alcance exacto fuera de Zaragoza pendiente de confirmar (docs/PENDIENTES.md).
    modalidades: ["En tu negocio, en Zaragoza", "Por videollamada", "Por WhatsApp o teléfono"],
  },

  telefono: {
    // Fuente: cliente. Es también el número de WhatsApp.
    visible: "633 27 59 09",
    e164: "+34633275909",
  },
  whatsapp: "34633275909",
  email: "umotionzaragoza@gmail.com", // Fuente: cliente, 30/09/2026

  /** Sin redes públicas todavía. Vacías = no se muestran. */
  redes: {
    instagram: "",
    linkedin: "",
  },

  /** Oferta confirmada por el cliente (30/09/2026): el primer diagnóstico es gratuito. */
  diagnosticoGratis: true,
} as const;

export const enlaces = {
  llamar: `tel:${negocio.telefono.e164}`,
  email: negocio.email ? `mailto:${negocio.email}` : "",
  whatsapp: (texto?: string) =>
    `https://wa.me/${negocio.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`,
};

/** Mensaje por defecto al abrir WhatsApp desde cualquier botón. */
export const saludoWhatsApp = "Hola, Umotion. Quería información sobre el diagnóstico gratuito para mi negocio.";

/**
 * Horario de atención (WhatsApp, teléfono y citas). Fuente: cliente, 30/09/2026.
 * Días: 0 = domingo … 6 = sábado. Tramos en minutos desde medianoche, hora de Zaragoza.
 */
export const horario: Record<number, ReadonlyArray<readonly [number, number]>> = {
  0: [],
  1: [[9 * 60, 20 * 60]],
  2: [[9 * 60, 20 * 60]],
  3: [[9 * 60, 20 * 60]],
  4: [[9 * 60, 20 * 60]],
  5: [[9 * 60, 20 * 60]],
  6: [[9 * 60, 20 * 60]],
};

export const horarioLegible = [
  { dias: "Lunes a sábado", horas: "9:00 – 20:00" },
  { dias: "Domingos", horas: "Cerrado" },
] as const;
