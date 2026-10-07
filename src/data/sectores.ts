import type { FotoKey } from "@/lib/fotos";

/**
 * Tipos de negocio a los que se dirige Umotion (fuente: cliente, 30/09/2026) y ejemplos de
 * automatizaciones habituales en cada uno. Son EJEMPLOS de lo que se puede automatizar,
 * no casos de clientes ni resultados: en la web se presentan siempre así.
 */

export type SectorId = "hosteleria" | "comercio" | "profesionales" | "pymes";

export type Regla = { cuando: string; entonces: string };

export type Sector = {
  id: SectorId;
  nombre: string;
  para: string;
  titular: string;
  foto: FotoKey;
  reglas: Regla[];
};

export const sectores: Sector[] = [
  {
    id: "hosteleria",
    nombre: "Hostelería",
    para: "Bares, restaurantes y cafeterías",
    titular: "Menos teléfono en plena hora punta.",
    foto: "sectorHosteleria",
    reglas: [
      { cuando: "Entra una reserva por WhatsApp o por la web", entonces: "Se apunta en tu agenda y el cliente recibe la confirmación" },
      { cuando: "Se acerca la hora de la reserva", entonces: "El cliente recibe un recordatorio y puede avisar si no viene" },
      { cuando: "Cierras la caja", entonces: "Te llega al móvil el resumen del día" },
      { cuando: "Llegan las facturas de proveedores", entonces: "Se ordenan solas en una hoja para tu gestoría" },
    ],
  },
  {
    id: "comercio",
    nombre: "Comercio",
    para: "Tiendas y comercio de barrio",
    titular: "Encargos y existencias bajo control.",
    foto: "sectorComercio",
    reglas: [
      { cuando: "Un cliente encarga por WhatsApp", entonces: "El encargo queda anotado con su número y su estado" },
      { cuando: "Un producto baja del mínimo", entonces: "Recibes un aviso para reponerlo" },
      { cuando: "El encargo está listo", entonces: "El cliente recibe un aviso para pasar a recogerlo" },
      { cuando: "Empieza la semana", entonces: "Tienes en tu correo lo que más se vendió la anterior" },
    ],
  },
  {
    id: "profesionales",
    nombre: "Profesionales",
    para: "Autónomos, despachos, clínicas y oficios",
    titular: "Más tiempo para tu trabajo, menos para la gestión.",
    foto: "sectorProfesionales",
    reglas: [
      { cuando: "Alguien pide cita", entonces: "Se agenda en tu calendario con confirmación y recordatorio" },
      { cuando: "Entra un correo de un cliente", entonces: "Se clasifica y la IA te deja preparado un borrador de respuesta" },
      { cuando: "Un cliente te envía documentos", entonces: "Se guardan en su carpeta con el nombre correcto" },
      { cuando: "Vence una factura sin cobrar", entonces: "Sale un recordatorio amable al cliente" },
    ],
  },
  {
    id: "pymes",
    nombre: "Pymes",
    para: "Empresas con equipo",
    titular: "Que el equipo no pierda horas copiando datos.",
    foto: "sectorPymes",
    reglas: [
      { cuando: "Entra un contacto por la web", entonces: "Se registra en tu gestión de clientes y se asigna a alguien" },
      { cuando: "Se aprueba un presupuesto", entonces: "Se crea el proyecto y se avisa a quien corresponde" },
      { cuando: "Empieza el día", entonces: "Llega un informe con las cifras que importan" },
      { cuando: "Un dato cambia en un programa", entonces: "Se actualiza en los demás sin teclearlo otra vez" },
    ],
  },
];

export const sectorPorId = (id: string) => sectores.find((s) => s.id === id);
