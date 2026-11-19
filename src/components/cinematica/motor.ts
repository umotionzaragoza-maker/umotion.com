import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { escenas, type EscenaId } from "./escenas";

/**
 * Motor de la portada cinemática: un haz de N hilos de luz que cambia de forma según el capítulo.
 *
 *   const cine = montarCine(lienzo, { escenas: ["fibras", "iris", …], lados: [1, -1, …] });
 *   cine.irA(2.4)        posición continua en la lista de escenas (2,4 = 40 % de la 3.ª a la 4.ª)
 *   cine.destruir()
 *
 * Todas las formas se calculan una vez y se guardan en una textura; el sombreador mezcla dos de ellas.
 * Así el número de escenas no tiene límite y cada fotograma cuesta lo mismo.
 * Brillo (bloom) solo en pantallas anchas; en móvil, menos hilos y resolución 1.
 */
export type Cine = { irA(x: number): void; destruir(): void };

type Opciones = { escenas: EscenaId[]; lados: number[]; reducir: boolean };

const M = 24; // puntos por hilo

function aleatorio(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VERT = /* glsl */ `
  uniform sampler2D uFormas;
  uniform int uAncho;
  uniform int uVertices;
  uniform int uA;
  uniform int uB;
  uniform float uF;
  uniform float uTiempo;
  uniform vec3 uGiro;   // velocidad de giro en Y de A, de B y crecimiento de la intro
  uniform vec2 uRueda;
  uniform vec2 uOnda;
  uniform float uEscala;
  uniform float uPixel;
  uniform float uEsPunto;
  attribute float aIndice;
  attribute float aT;
  attribute float aR;
  varying float vT;
  varying float vBlanco;
  varying float vAlfa;

  vec4 forma(int escena) {
    int i = escena * uVertices + int(aIndice);
    return texelFetch(uFormas, ivec2(i % uAncho, i / uAncho), 0);
  }

  vec3 girarY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 girarZ(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
  }
  vec3 animar(vec4 f, float giro, float rueda, float onda) {
    vec3 p = f.xyz;
    // Ondulación: cada espiga se dobla según su posición, como trigo al viento.
    p.x += sin(uTiempo * 1.4 + p.x * 1.7 + aR * 0.8) * 0.22 * aT * aT * onda;
    p = girarY(p, uTiempo * giro);
    p = girarZ(p, uTiempo * rueda);
    return p;
  }

  void main() {
    vec4 a = forma(uA);
    vec4 b = forma(uB);
    // Cada hilo llega a su sitio con un pequeño retraso propio: la transición se ve como un enjambre.
    float f = smoothstep(0.0, 1.0, clamp(uF * 1.35 - aR * 0.35, 0.0, 1.0));
    vec3 p = mix(animar(a, uGiro.x, uRueda.x, uOnda.x), animar(b, uGiro.y, uRueda.y, uOnda.y), f);
    // Vida: un vaivén suave que nunca deja la imagen quieta.
    p += vec3(sin(uTiempo * 0.7 + aR * 6.28 + aT * 2.0), cos(uTiempo * 0.55 + aR * 4.0 + aT * 3.0), 0.0) * 0.035 * aT;
    // A mitad de transición los hilos se dispersan un poco hacia fuera.
    p *= 1.0 + sin(f * 3.14159) * 0.12 * (aR - 0.3);
    p *= uEscala;

    vT = aT;
    vBlanco = mix(a.w, b.w, f);
    // Intro: los hilos crecen desde la raíz.
    vAlfa = 1.0 - smoothstep(uGiro.z - 0.08, uGiro.z, aT);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    if (uEsPunto > 0.5) {
      float punta = smoothstep(0.86, 1.0, aT);
      float tam = mix(1.6, 7.5, punta) * (0.6 + aR * 0.8);
      gl_PointSize = tam * uPixel * (6.0 / -mv.z);
    }
  }
`;

const FRAG = /* glsl */ `
  uniform float uEsPunto;
  uniform float uBrillo;
  varying float vT;
  varying float vBlanco;
  varying float vAlfa;
  void main() {
    // Degradado de la U: azul hondo en la raíz, cian en el cuerpo, casi blanco en la punta.
    vec3 hondo = vec3(0.10, 0.16, 0.85);
    vec3 cian = vec3(0.20, 0.72, 1.0);
    vec3 col = mix(hondo, cian, smoothstep(0.0, 0.85, vT));
    col = mix(col, vec3(0.85, 0.95, 1.0), smoothstep(0.88, 1.0, vT) * 0.8);
    col = mix(col, vec3(0.92, 0.96, 1.0), vBlanco);
    float alfa;
    if (uEsPunto > 0.5) {
      float d = length(gl_PointCoord - 0.5);
      alfa = pow(smoothstep(0.5, 0.0, d), 1.6);
      alfa *= mix(0.16, 0.9, smoothstep(0.86, 1.0, vT));
    } else {
      alfa = mix(0.02, 0.13, vT) + vBlanco * 0.3;
    }
    gl_FragColor = vec4(col * uBrillo, alfa * vAlfa);
  }
`;

export function montarCine(lienzo: HTMLCanvasElement, op: Opciones): Cine {
  const movil = window.matchMedia("(max-width: 767px)").matches;
  const N = movil ? 300 : 560;
  const V = N * M;
  const L = op.escenas.length;

  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: !movil, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, movil ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 1);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camara.position.set(0, 0, 6);

  // ── Formas: todas las escenas en una textura (fila tras fila; escena tras escena).
  const ancho = 2048;
  const alto = Math.ceil((V * L) / ancho);
  const datos = new Float32Array(ancho * alto * 4);
  const azar = aleatorio(7);
  const r: number[][] = Array.from({ length: N }, () => Array.from({ length: 6 }, azar));
  op.escenas.forEach((id, e) => {
    const gen = escenas[id].generar;
    for (let s = 0; s < N; s++)
      for (let j = 0; j < M; j++) {
        const p = gen(s, j, M, N, r[s]!);
        const o = (e * V + s * M + j) * 4;
        datos[o] = p[0];
        datos[o + 1] = p[1];
        datos[o + 2] = p[2];
        datos[o + 3] = p[3];
      }
  });
  const formas = new THREE.DataTexture(datos, ancho, alto, THREE.RGBAFormat, THREE.FloatType);
  formas.needsUpdate = true;

  // ── Geometría: solo índices; las posiciones salen de la textura.
  const indice = new Float32Array(V);
  const tt = new Float32Array(V);
  const rr = new Float32Array(V);
  for (let s = 0; s < N; s++)
    for (let j = 0; j < M; j++) {
      const i = s * M + j;
      indice[i] = i;
      tt[i] = j / (M - 1);
      rr[i] = r[s]![5]!;
    }
  const atributos = {
    position: new THREE.BufferAttribute(new Float32Array(V * 3), 3),
    aIndice: new THREE.BufferAttribute(indice, 1),
    aT: new THREE.BufferAttribute(tt, 1),
    aR: new THREE.BufferAttribute(rr, 1),
  };
  const geoPuntos = new THREE.BufferGeometry();
  const geoLineas = new THREE.BufferGeometry();
  for (const [k, v] of Object.entries(atributos)) {
    geoPuntos.setAttribute(k, v);
    geoLineas.setAttribute(k, v);
  }
  const segmentos: number[] = [];
  for (let s = 0; s < N; s++) for (let j = 0; j < M - 1; j++) segmentos.push(s * M + j, s * M + j + 1);
  geoLineas.setIndex(segmentos);
  // Las posiciones reales están en la textura: evitar que se recorte por una caja vacía.
  geoPuntos.boundingSphere = geoLineas.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

  const uniformes = {
    uFormas: { value: formas },
    uAncho: { value: ancho },
    uVertices: { value: V },
    uA: { value: 0 },
    uB: { value: 0 },
    uF: { value: 0 },
    uTiempo: { value: 0 },
    uGiro: { value: new THREE.Vector3(0, 0, op.reducir ? 1.2 : 0) },
    uRueda: { value: new THREE.Vector2() },
    uOnda: { value: new THREE.Vector2() },
    uEscala: { value: 1 },
    uPixel: { value: renderer.getPixelRatio() },
    uEsPunto: { value: 1 },
    uBrillo: { value: 1 },
  };
  const material = (punto: boolean) =>
    new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { ...uniformes, uEsPunto: { value: punto ? 1 : 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  const matPuntos = material(true);
  const matLineas = material(false);
  const grupo = new THREE.Group();
  grupo.add(new THREE.LineSegments(geoLineas, matLineas), new THREE.Points(geoPuntos, matPuntos));
  escena.add(grupo);

  // ── Brillo
  let composer: EffectComposer | null = null;
  if (!movil) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(escena, camara));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), 0.7, 0.32, 0.12));
    composer.addPass(new OutputPass());
  }

  let aspecto = 1;
  const redimensionar = () => {
    const w = lienzo.clientWidth;
    const h = lienzo.clientHeight;
    if (!w || !h) return;
    aspecto = w / h;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camara.aspect = aspecto;
    camara.updateProjectionMatrix();
    // En vertical, la escena se encoge para caber de lado a lado.
    uniformes.uEscala.value = aspecto < 1 ? Math.max(0.55, aspecto * 0.95) : 1;
  };
  const ro = new ResizeObserver(redimensionar);
  ro.observe(lienzo);
  redimensionar();

  // ── Ratón: la cámara se inclina un poco hacia él.
  const raton = { x: 0, y: 0 };
  const alMover = (e: PointerEvent) => {
    raton.x = (e.clientX / window.innerWidth) * 2 - 1;
    raton.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", alMover, { passive: true });

  let objetivo = 0;
  let actual = 0;
  let desplazX = 0;
  const reloj = new THREE.Timer();
  let raf = 0;
  let visible = true;

  const fijarUniformes = () => {
    const a = Math.min(L - 1, Math.max(0, Math.floor(actual)));
    const b = Math.min(L - 1, a + 1);
    const f = actual - a;
    const ea = escenas[op.escenas[a]!];
    const eb = escenas[op.escenas[b]!];
    for (const m of [matPuntos, matLineas]) {
      const u = m.uniforms;
      u.uA!.value = a;
      u.uB!.value = b;
      u.uF!.value = f;
      (u.uGiro!.value as THREE.Vector3).set(ea.giro ?? 0, eb.giro ?? 0, uniformes.uGiro.value.z);
      (u.uRueda!.value as THREE.Vector2).set(ea.rueda ?? 0, eb.rueda ?? 0);
      (u.uOnda!.value as THREE.Vector2).set(ea.onda ?? 0, eb.onda ?? 0);
      u.uTiempo!.value = uniformes.uTiempo.value;
      u.uEscala!.value = uniformes.uEscala.value;
    }
    // La escena se aparta al lado contrario del texto en pantallas anchas.
    const ancha = aspecto > 1.15;
    const lado = (op.lados[a]! * (1 - f) + op.lados[b]! * f) * (ancha ? Math.min(1.45, (aspecto - 1) * 1.6) : 0);
    desplazX += (lado - desplazX) * 0.06;
    grupo.position.x = desplazX;
    grupo.position.y = ancha ? 0 : 0.35;
  };

  const pintar = () => {
    if (composer) composer.render();
    else renderer.render(escena, camara);
  };

  const fotograma = () => {
    raf = requestAnimationFrame(fotograma);
    if (!visible) return;
    reloj.update();
    const dt = Math.min(reloj.getDelta(), 0.05);
    uniformes.uTiempo.value += dt;
    const g = uniformes.uGiro.value;
    if (g.z < 1.2) g.z = Math.min(1.2, g.z + dt * 0.55);
    actual += (objetivo - actual) * (1 - Math.exp(-dt * 3.2));
    camara.position.x += (raton.x * 0.35 - camara.position.x) * 0.04;
    camara.position.y += (-raton.y * 0.25 - camara.position.y) * 0.04;
    camara.lookAt(0, 0, 0);
    fijarUniformes();
    pintar();
  };

  const alVisibilidad = () => {
    visible = document.visibilityState === "visible";
    reloj.reset?.();
  };
  document.addEventListener("visibilitychange", alVisibilidad);

  if (op.reducir) {
    // Sin movimiento: un fotograma fijo por capítulo.
    fijarUniformes();
    desplazX = grupo.position.x;
    pintar();
  } else {
    raf = requestAnimationFrame(fotograma);
  }

  return {
    irA(x) {
      objetivo = Math.min(L - 1, Math.max(0, x));
      if (op.reducir) {
        actual = Math.round(objetivo);
        fijarUniformes();
        grupo.position.x = desplazX = (op.lados[actual] ?? 0) * (aspecto > 1.15 ? Math.min(1.45, (aspecto - 1) * 1.6) : 0);
        pintar();
      }
    },
    destruir() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", alMover);
      document.removeEventListener("visibilitychange", alVisibilidad);
      geoPuntos.dispose();
      geoLineas.dispose();
      matPuntos.dispose();
      matLineas.dispose();
      formas.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
}
