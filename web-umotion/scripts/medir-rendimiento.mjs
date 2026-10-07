// Medición de laboratorio con las condiciones de Lighthouse, sin instalar nada: usa el
// Chrome o Edge del equipo en modo sin interfaz y el protocolo de DevTools.
//
//   npm run start                                   (en otra terminal)
//   npm run medir                                   móvil, rutas principales
//   npm run medir -- escritorio / /servicios           perfil y rutas a elección
//
// Móvil: CPU 4× más lenta, 150 ms de latencia, 1,6 Mbps. Escritorio: 40 ms, 10 Mbps.
// Cada ruta se carga dos veces sin caché y se muestra la segunda (servidor ya en caliente).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const perfil = args[0] === "escritorio" || args[0] === "movil" ? args.shift() : "movil";
const rutas = args.length ? args : ["/", "/servicios", "/ejemplos", "/diagnostico", "/nosotros", "/contacto"];
const base = process.env.BASE ?? "http://localhost:5201";
const MOVIL = perfil === "movil";

const candidatos = [
  process.env.CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const navegador = candidatos.find((c) => existsSync(c));
if (!navegador) {
  console.error("No se encuentra Chrome ni Edge. Indica la ruta con la variable CHROME.");
  process.exit(1);
}

const puerto = 9300 + Math.floor(Math.random() * 600);
const perfilDir = mkdtempSync(join(tmpdir(), "medir-"));
const proceso = spawn(navegador, ["--headless=new", `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfilDir}`, "--no-first-run", "--mute-audio", "about:blank"], { stdio: "ignore" });
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try {
    wsUrl = (await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await esperar(200);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pendientes = new Map();
const oyentes = new Set();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id) pendientes.get(m.id)?.(m.result ?? m), pendientes.delete(m.id);
  else oyentes.forEach((f) => f(m));
});
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; pendientes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await cdp("Page.enable");
await cdp("Network.enable");
await cdp("Network.setCacheDisabled", { cacheDisabled: true });
await cdp("Network.emulateNetworkConditions", MOVIL
  ? { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 }
  : { offline: false, latency: 40, downloadThroughput: (10 * 1024 * 1024) / 8, uploadThroughput: (10 * 1024 * 1024) / 8 });
await cdp("Emulation.setCPUThrottlingRate", { rate: MOVIL ? 4 : 1 });
await cdp("Emulation.setDeviceMetricsOverride", MOVIL
  ? { width: 412, height: 823, deviceScaleFactor: 1.75, mobile: true }
  : { width: 1350, height: 940, deviceScaleFactor: 1, mobile: false });
await cdp("Emulation.setTouchEmulationEnabled", { enabled: MOVIL });
await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `
  window.__m = { lcp: 0, cls: 0, lt: [] };
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lt.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true });
` });

const bytes = new Map();
oyentes.add((m) => {
  if (m.method === "Network.responseReceived") bytes.set(m.params.requestId, { tipo: m.params.type, b: 0 });
  if (m.method === "Network.loadingFinished" && bytes.has(m.params.requestId)) bytes.get(m.params.requestId).b = m.params.encodedDataLength;
});

async function medir(ruta) {
  bytes.clear();
  const cargado = new Promise((r) => { const f = (m) => { if (m.method === "Page.loadEventFired") { oyentes.delete(f); r(); } }; oyentes.add(f); });
  await cdp("Page.navigate", { url: base + ruta });
  await cargado;
  await esperar(MOVIL ? 5000 : 2500);
  const r = await cdp("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
    const tbt = window.__m.lt.filter(([s]) => s >= fcp).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
    return { fcp, lcp: window.__m.lcp, cls: window.__m.cls, tbt };
  })()` });
  const kb = (f) => Math.round([...bytes.values()].filter(f).reduce((a, x) => a + x.b, 0) / 1024);
  const v = r.result.value;
  return {
    ruta,
    "1er pintado": `${(v.fcp / 1000).toFixed(2)} s`,
    LCP: `${(v.lcp / 1000).toFixed(2)} s`,
    CLS: v.cls.toFixed(3),
    TBT: `${Math.round(v.tbt)} ms`,
    "JS KB": kb((x) => x.tipo === "Script"),
    "total KB": kb(() => true),
  };
}

const filas = [];
for (const ruta of rutas) {
  await medir(ruta);
  filas.push(await medir(ruta));
}
console.log(`\n${MOVIL ? "Móvil (CPU 4×, 150 ms, 1,6 Mbps)" : "Escritorio (40 ms, 10 Mbps)"} · ${base}`);
console.table(filas);
console.log("Referencia de Lighthouse (verde): LCP ≤ 2,5 s · CLS ≤ 0,1 · TBT ≤ 200 ms.\n");

ws.close();
proceso.kill();
await esperar(400);
try { rmSync(perfilDir, { recursive: true, force: true }); } catch {}
process.exit(0);
