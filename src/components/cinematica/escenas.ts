/**
 * Formas del haz de fibras. Cada escena coloca los mismos N hilos (de M puntos cada uno) en una forma distinta;
 * el motor pasa de una a otra mientras se baja por la portada.
 *
 * Una escena devuelve, para el punto j del hilo s, [x, y, z, blanco]: posición en el mundo (la vista mide unas
 * 4,4 unidades de alto) y cuánto se acerca el color al blanco (0 = degradado azul de la marca, 1 = blanco).
 * `r` son seis números aleatorios fijos del hilo, iguales en todas las escenas.
 *
 * Para crear una escena nueva: añade su id a EscenaId y su función a `escenas`. No hay límite de escenas.
 */

export type EscenaId = "fibras" | "enredo" | "iris" | "onda" | "red" | "u";

type Punto = [number, number, number, number];
type Generador = (s: number, j: number, M: number, N: number, r: readonly number[]) => Punto;

export type Escena = {
  generar: Generador;
  /** Giro lento alrededor del eje vertical (radianes por segundo). */
  giro?: number;
  /** Giro en el plano de la pantalla, como una rueda (radianes por segundo). */
  rueda?: number;
  /** Ondulación tipo campo de trigo (0 a 1). */
  onda?: number;
};

const TAU = Math.PI * 2;

/** Cientos de fibras que cuelgan desde arriba y se abren hacia abajo. Las puntas brillan. */
const fibras: Generador = (s, j, M, _N, r) => {
  const t = j / (M - 1);
  const x0 = (r[0]! - 0.5) * 1.1;
  const arriba = 2.7 + r[1]! * 0.5;
  const largo = 2.4 + r[2]! * 2.3;
  const xFin = x0 * 1.8 + (r[3]! - 0.5) * 1.8;
  const y = arriba - largo * t;
  const x = x0 + (xFin - x0) * t * t + Math.sin(t * 2.6 + r[4]! * TAU) * 0.14 * t;
  const z = (r[5]! - 0.5) * 2.2 * t + (r[0]! - 0.5) * 0.4;
  return [x, y, z, 0];
};

/** Maraña: cada hilo es un bucle alrededor de un punto de una esfera. */
const enredo: Generador = (s, j, M, _N, r) => {
  const t = j / (M - 1);
  const th = r[0]! * TAU;
  const ph = Math.acos(2 * r[1]! - 1);
  const rad = 1.25 * Math.cbrt(r[2]!);
  const cx = rad * Math.sin(ph) * Math.cos(th);
  const cy = rad * Math.cos(ph);
  const cz = rad * Math.sin(ph) * Math.sin(th);
  const a = t * Math.PI * (1.6 + r[3]! * 2.2) + r[4]! * TAU;
  const k = 0.45 + r[5]! * 0.45;
  return [cx + Math.cos(a) * k, cy + Math.sin(a * 1.3 + r[3]! * 4) * k, cz + Math.sin(a * 0.7 + r[5]! * 6) * k, 0];
};

/** Iris: fibras del centro hacia fuera y, alrededor, un anillo blanco de radios. */
const iris: Generador = (s, j, M, N, r) => {
  const t = j / (M - 1);
  const radios = Math.floor(N * 0.12);
  const arcos = Math.floor(N * 0.05);
  if (s < radios) {
    const th = (s / radios) * TAU;
    const rr = 1.66 + t * 0.26;
    return [Math.cos(th) * rr, Math.sin(th) * rr, 0, 1];
  }
  if (s < radios + arcos) {
    const k = s - radios;
    const exterior = k % 2 === 0;
    const th = (Math.floor(k / 2) / (arcos / 2)) * TAU + t * (TAU / (arcos / 2)) * 1.05;
    const rr = exterior ? 1.93 : 1.64;
    return [Math.cos(th) * rr, Math.sin(th) * rr, 0, 0.9];
  }
  const th = r[0]! * TAU + Math.sin(t * 3 + r[1]! * 6) * 0.05;
  const desde = 0.34 + r[1]! * 0.08;
  const hasta = 0.95 + r[2]! * 0.6;
  const rr = desde + (hasta - desde) * t;
  return [Math.cos(th) * rr, Math.sin(th) * rr, (r[3]! - 0.5) * 0.2 + t * 0.12, t * t * 0.35];
};

/** Arco de filamentos de pie, como espigas: el motor lo ondula. */
const onda: Generador = (s, j, M, N, r) => {
  const t = j / (M - 1);
  const u = (s + r[0]! * 0.9) / N;
  const th = Math.PI * (0.06 + 0.88 * u);
  const bx = -Math.cos(th) * 2.5;
  const by = Math.sin(th) * 1.15 - 1.25;
  const bz = (r[1]! - 0.5) * 1.1;
  const dx = -Math.cos(th) * 0.45 + (r[2]! - 0.5) * 0.25;
  const dy = 0.9;
  const largo = 0.45 + r[3]! * 0.95;
  return [bx + dx * largo * t, by + dy * largo * t, bz + (r[4]! - 0.5) * 0.15 * t, 0];
};

/** Esfera de rutas: arcos de círculo máximo, como un mapa de conexiones. */
const red: Generador = (s, j, M, _N, r) => {
  const t = j / (M - 1);
  // Eje aleatorio y dos vectores perpendiculares.
  const th = r[0]! * TAU;
  const z0 = 2 * r[1]! - 1;
  const q = Math.sqrt(1 - z0 * z0);
  const n = [q * Math.cos(th), z0, q * Math.sin(th)] as const;
  const a = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let ux = a[1]! * n[2] - a[2]! * n[1];
  let uy = a[2]! * n[0] - a[0]! * n[2];
  let uz = a[0]! * n[1] - a[1]! * n[0];
  const l = Math.hypot(ux, uy, uz);
  ux /= l;
  uy /= l;
  uz /= l;
  const vx = n[1] * uz - n[2] * uy;
  const vy = n[2] * ux - n[0] * uz;
  const vz = n[0] * uy - n[1] * ux;
  const ang = r[2]! * TAU + t * (0.5 + r[3]! * 1.3);
  const R = 1.6 + (r[4]! - 0.5) * 0.05;
  const c = Math.cos(ang) * R;
  const si = Math.sin(ang) * R;
  return [ux * c + vx * si, uy * c + vy * si, uz * c + vz * si, r[5]! > 0.92 ? 0.8 : 0.1];
};

/** La U de Umotion con su flecha: hilos que recorren el trazo y, arriba a la derecha, la punta. */
const TRAZO = (() => {
  // Brazo izquierdo (bajando), curva inferior y brazo derecho (subiendo). Medidas en unidades del mundo.
  const W = 0.86;
  const arriba = 1.0;
  const base = -0.25;
  const brazoIzq = arriba - base;
  const curva = Math.PI * W;
  const brazoDer = 0.85 - base;
  const total = brazoIzq + curva + brazoDer;
  const punto = (u: number): [number, number, number, number] => {
    // Devuelve x, y y la dirección normal (nx, ny) del trazo en el tramo u (0 a total).
    if (u < brazoIzq) return [-W, arriba - u, -1, 0];
    if (u < brazoIzq + curva) {
      const a = Math.PI + (u - brazoIzq) / W;
      return [Math.cos(a) * W, base + Math.sin(a) * W, Math.cos(a), Math.sin(a)];
    }
    return [W, base + (u - brazoIzq - curva), 1, 0];
  };
  return { total, punto, W };
})();

const u: Generador = (s, j, M, N, r) => {
  const t = j / (M - 1);
  const punta = Math.floor(N * 0.16);
  if (s < punta) {
    // Triángulo de la flecha relleno de espigas verticales: más altas en el centro, a ras en los lados.
    const k = r[0]! * 2 - 1;
    const bx = TRAZO.W + k * 0.55;
    const by = 0.85;
    const alto = (1 - Math.abs(k)) * 0.85;
    return [bx, by + alto * t, (r[1]! - 0.5) * 0.12, 0.2];
  }
  const tramo = 0.55;
  const u0 = r[0]! * (TRAZO.total - tramo);
  const [x, y, nx, ny] = TRAZO.punto(u0 + tramo * t);
  const ancho = (r[1]! - 0.5) * 0.5;
  return [x + nx * ancho, y + ny * ancho, (r[2]! - 0.5) * 0.18, 0.1];
};

export const escenas: Record<EscenaId, Escena> = {
  fibras: { generar: fibras },
  enredo: { generar: enredo, giro: 0.22 },
  iris: { generar: iris, rueda: 0.07 },
  onda: { generar: onda, onda: 1 },
  red: { generar: red, giro: 0.18 },
  u: { generar: u },
};
