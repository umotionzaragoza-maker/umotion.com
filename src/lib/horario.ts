import { horario } from "@/data/negocio";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WD: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Día de la semana y minutos desde medianoche en Zaragoza, sin depender de la zona del visitante. */
export function ahoraEnZaragoza(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  return { dia: WD[get("weekday")] ?? 0, minutos: Number(get("hour")) * 60 + Number(get("minute")) };
}

const hhmm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

export type EstadoAtencion = {
  atendiendo: boolean;
  /** Texto corto para la cabecera: "Atendemos · hasta 20:00" */
  corto: string;
  /** Texto largo junto al horario */
  largo: string;
};

/**
 * Umotion no tiene local: el estado es el del horario de atención (WhatsApp y teléfono).
 * Fuera de horario se puede escribir igualmente; se responde al volver.
 */
export function estadoAtencion(fecha = new Date()): EstadoAtencion {
  const { dia, minutos } = ahoraEnZaragoza(fecha);
  const hoy = horario[dia] ?? [];
  const tramo = hoy.find(([a, c]) => minutos >= a && minutos < c);

  if (tramo) {
    return {
      atendiendo: true,
      corto: `Atendemos · hasta ${hhmm(tramo[1])}`,
      largo: `Ahora estamos atendiendo, hasta las ${hhmm(tramo[1])}.`,
    };
  }

  const luegoHoy = hoy.find(([a]) => a > minutos);
  if (luegoHoy) {
    return {
      atendiendo: false,
      corto: `Volvemos a las ${hhmm(luegoHoy[0])}`,
      largo: `Ahora fuera de horario. Escríbenos y te respondemos a partir de las ${hhmm(luegoHoy[0])}.`,
    };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const primero = (horario[d] ?? [])[0];
    if (primero) {
      const cuando = i === 1 ? "mañana" : `el ${DIAS[d]}`;
      return {
        atendiendo: false,
        corto: `Volvemos ${cuando} a las ${hhmm(primero[0])}`,
        largo: `Ahora fuera de horario. Escríbenos y te respondemos ${cuando} a partir de las ${hhmm(primero[0])}.`,
      };
    }
  }
  return { atendiendo: false, corto: "Fuera de horario", largo: "Ahora fuera de horario." };
}
