import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Grulla de papel en 3D (Three.js). El modelo sale de Blender (scripts/3d/grulla.py) como una sola
 * hoja con «shape keys»: plana → base preliminar (pliegue rígido real) → grulla → alas bajadas.
 *
 *   const api = await montarGrulla(host, { interactiva: true });
 *   api.fase(q)    q de 0 a 3: 0 hoja plana · 1 base preliminar · 2 grulla · 3 vuela
 *   api.destruir()
 *
 * Se pausa fuera de pantalla y limita la resolución en móvil.
 */
export type Grulla = { fase(q: number): void; destruir(): void };

const MODELO = "/3d/grulla.glb";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (t: number) => {
  t = clamp(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cara impresa: degradado de la U (cian → azul → violeta) con los pliegues de la base marcados. */
function texturaPapel() {
  const n = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const g = c.getContext("2d")!;
  const d = g.createLinearGradient(n, n * 0.5, 0, n * 0.5); // de la cabeza a la cola
  d.addColorStop(0, "#35c8ff");
  d.addColorStop(0.55, "#2e5bf5");
  d.addColorStop(1, "#4b3bf0");
  g.fillStyle = d;
  g.fillRect(0, 0, n, n);

  // Fibra del papel.
  const img = g.getImageData(0, 0, n, n);
  const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = (Math.random() - 0.5) * 10;
    px[i] = px[i]! + r;
    px[i + 1] = px[i + 1]! + r;
    px[i + 2] = px[i + 2]! + r;
  }
  g.putImageData(img, 0, 0);

  // Pliegues: diagonales y líneas al centro de cada borde (en coordenadas UV de la hoja).
  g.strokeStyle = "rgba(255,255,255,0.28)";
  g.lineWidth = 2.2;
  const puntos: [number, number][] = [[1, 0.5], [0.5, 1], [0, 0.5], [0.5, 0], [0.75, 0.75], [0.25, 0.75], [0.25, 0.25], [0.75, 0.25]];
  for (const [x, y] of puntos) {
    g.beginPath();
    g.moveTo(0.5 * n, 0.5 * n);
    g.lineTo(x * n, y * n);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Relieve de fibra para las dos caras. */
function texturaFibra() {
  const n = 256;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const g = c.getContext("2d")!;
  const img = g.createImageData(n, n);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 70;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

function materialPapel() {
  const m = new THREE.MeshPhysicalMaterial({
    map: texturaPapel(),
    bumpMap: texturaFibra(),
    bumpScale: 0.6,
    roughness: 0.74,
    metalness: 0,
    sheen: 0.5,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color("#9fdcff"),
    side: THREE.DoubleSide,
    flatShading: true,
  });
  // Reverso de la hoja: azul hondo de marca (#2b52f0), para que la grulla quede entera en azul.
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
       if (!gl_FrontFacing) diffuseColor.rgb = vec3(0.024, 0.085, 0.86);`,
    );
  };
  return m;
}

export async function montarGrulla(host: HTMLElement, opts: { interactiva?: boolean } = {}): Promise<Grulla> {
  const lienzo = document.createElement("canvas");
  lienzo.setAttribute("role", "img");
  lienzo.setAttribute("aria-label", "Hoja de papel que se dobla hasta formar la grulla de Umotion");
  lienzo.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

  const render = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: "high-performance" });
  render.outputColorSpace = THREE.SRGBColorSpace;
  render.toneMapping = THREE.ACESFilmicToneMapping;
  render.toneMappingExposure = 1.05;
  render.shadowMap.enabled = true;
  render.shadowMap.type = THREE.PCFShadowMap;

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(render);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environment = entorno;
  escena.environmentIntensity = 0.55;

  const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 50);

  // Luz principal cálida (con sombra), relleno cian y contraluz azul de marca.
  const sol = new THREE.DirectionalLight("#fff6ea", 2.6);
  sol.position.set(-2.5, 5, 3);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  sol.shadow.camera.left = sol.shadow.camera.bottom = -2.2;
  sol.shadow.camera.right = sol.shadow.camera.top = 2.2;
  sol.shadow.normalBias = 0.03;
  sol.shadow.radius = 4;
  escena.add(sol);
  const relleno = new THREE.DirectionalLight("#35c8ff", 0.9);
  relleno.position.set(3, 1, 2);
  escena.add(relleno);
  const contra = new THREE.DirectionalLight("#2b52f0", 2.2);
  contra.position.set(0, 2, -4);
  escena.add(contra);

  // Halo bajo la pieza.
  const halo = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const d = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    d.addColorStop(0, "rgba(53,200,255,0.55)");
    d.addColorStop(0.45, "rgba(43,82,240,0.18)");
    d.addColorStop(1, "rgba(43,82,240,0)");
    g.fillStyle = d;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.2),
      new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = -0.9;
    escena.add(m);
    return m;
  })();

  const pivote = new THREE.Group();
  escena.add(pivote);

  const gltf = await new GLTFLoader().loadAsync(MODELO);
  let hoja: THREE.Mesh | null = null;
  gltf.scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) hoja = o as THREE.Mesh;
  });
  if (!hoja) throw new Error("Modelo de la grulla sin malla");
  const malla: THREE.Mesh = hoja;
  const materialViejo = malla.material as THREE.Material;
  malla.material = materialPapel();
  materialViejo.dispose();
  malla.castShadow = malla.receiveShadow = true;
  malla.frustumCulled = false; // las shape keys sacan la pieza de su caja original
  pivote.add(malla);

  const dic = malla.morphTargetDictionary!;
  const inf = malla.morphTargetInfluences!;
  const K = (n: string) => {
    const i = dic[n];
    if (i === undefined) throw new Error(`Falta la shape key «${n}»`);
    return i;
  };
  const pliegues = [K("pliegue_1"), K("pliegue_2"), K("pliegue_3"), K("pliegue_4")];
  const kGrulla = K("grulla");
  const kAlas = K("alas");
  /** Mezcla de shape keys para q (0–3) y el aleteo. */
  function formas(q: number, t: number) {
    inf.fill(0);
    if (q < 1) {
      const s = 4 * suave(clamp(q)); // 0 plana … 4 base cerrada
      const k = Math.min(3, Math.floor(s));
      const f = s - k;
      if (k > 0) inf[pliegues[k - 1]!] = 1 - f;
      inf[pliegues[k]!] = f;
    } else {
      const c = suave(clamp(q - 1)); // base → grulla
      inf[pliegues[3]!] = 1 - c;
      const vuelo = clamp(q - 2);
      const aleteo = vuelo * (0.5 + 0.5 * Math.sin(t * 3.1)) * 0.85;
      inf[kGrulla] = c * (1 - aleteo);
      inf[kAlas] = c * aleteo;
    }
  }

  // Estado
  let objetivo = 0;
  let q = 0;
  let giro = -0.6;
  let inclinacion = 0;
  let velGiro = 0;
  let arrastre: { x: number; y: number } | null = null;
  let ultimoToque = -1e9;
  let tiempo = 0;
  let ancho = 1;
  let alto = 1;

  function medir() {
    const r = host.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    render.setPixelRatio(Math.min(window.devicePixelRatio || 1, ancho < 700 ? 1.5 : 2));
    render.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }

  if (opts.interactiva) {
    lienzo.style.cursor = "grab";
    lienzo.style.touchAction = "pan-y";
    lienzo.addEventListener("pointerdown", (e) => {
      arrastre = { x: e.clientX, y: e.clientY };
      velGiro = 0;
      lienzo.style.cursor = "grabbing";
      lienzo.setPointerCapture?.(e.pointerId);
    });
    lienzo.addEventListener("pointermove", (e) => {
      if (!arrastre) return;
      const dx = e.clientX - arrastre.x;
      const dy = e.clientY - arrastre.y;
      arrastre = { x: e.clientX, y: e.clientY };
      giro += dx * 0.009;
      velGiro = dx * 0.009;
      inclinacion = clamp(inclinacion + dy * 0.005, -0.45, 0.5);
      ultimoToque = performance.now();
    });
    const soltar = () => {
      if (!arrastre) return;
      arrastre = null;
      lienzo.style.cursor = "grab";
      ultimoToque = performance.now();
    };
    for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) lienzo.addEventListener(ev, soltar);
  }

  function pintar() {
    const plana = 1 - suave(clamp(q / 0.9));
    const grulla = suave(clamp(q - 1));
    const vuelo = suave(clamp(q - 2));

    formas(q, tiempo);

    // Cámara: desde arriba con la hoja plana, a la altura de la grulla después.
    const elev = mezcla(mezcla(0.95, 0.42, 1 - plana), 0.2, grulla);
    let dist = mezcla(5.4, 4.6, 1 - plana);
    dist = mezcla(dist, 5.1, grulla);
    if (camara.aspect < 1) dist *= Math.min(2.1, 1 / camara.aspect);
    camara.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist);
    camara.lookAt(0, mezcla(0, 0.3, grulla), 0);

    // La pieza sube al cerrarse y, en vuelo, flota y se ladea.
    const flota = vuelo * (0.18 + Math.sin(tiempo * 1.2) * 0.07);
    pivote.position.y = mezcla(0, -0.25, grulla) + flota;
    pivote.rotation.set(inclinacion + vuelo * Math.sin(tiempo * 0.9) * 0.06, giro, vuelo * Math.sin(tiempo * 0.7) * 0.08);
    halo.position.y = mezcla(-0.02, -0.75, suave(clamp(q - 0.4)));
    (halo.material as THREE.MeshBasicMaterial).opacity = mezcla(0.6, 1, grulla) - vuelo * 0.2;

    render.render(escena, camara);
  }

  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  let raf = 0;
  let antes = performance.now();
  function bucle(ahora: number) {
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    antes = ahora;
    tiempo += dt;
    q += (objetivo - q) * (1 - Math.pow(0.004, dt));
    if (Math.abs(objetivo - q) < 1e-4) q = objetivo;
    if (!arrastre) {
      giro += velGiro;
      velGiro *= Math.pow(0.05, dt);
      inclinacion += (0 - inclinacion) * (1 - Math.pow(0.3, dt));
      if (!reducir && ahora - ultimoToque > 2200) giro += dt * (q > 2 ? 0.2 : 0.07);
    }
    pintar();
    raf = visible ? requestAnimationFrame(bucle) : 0;
  }

  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible && !raf) {
      antes = performance.now();
      raf = requestAnimationFrame(bucle);
    }
  });
  const ro = new ResizeObserver(() => {
    medir();
    pintar();
  });

  host.appendChild(lienzo);
  medir();
  pintar();
  io.observe(host);
  ro.observe(host);
  raf = requestAnimationFrame(bucle);

  return {
    fase(v) {
      objetivo = clamp(v, 0, 3);
    },
    destruir() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      malla.geometry.dispose();
      const m = malla.material as THREE.MeshPhysicalMaterial;
      m.map?.dispose();
      m.bumpMap?.dispose();
      m.dispose();
      entorno.dispose();
      pmrem.dispose();
      render.dispose();
      render.forceContextLoss();
      lienzo.remove();
    },
  };
}
