// Auditoría automática de SEO y accesibilidad de todas las URL del sitemap, sin instalar nada:
// usa el Chrome o Edge del equipo en modo sin interfaz y el protocolo de DevTools.
//
//   npm run start          (en otra terminal)
//   npm run auditar        a 1440 y 390 px
//
// Revisa: título y descripción (longitud y repetidos), canonical, og, lang, JSON-LD válido, un h1,
// saltos de títulos, imágenes sin alt, controles sin nombre, campos sin etiqueta, ids duplicados,
// objetivos táctiles < 24 px y contraste de texto sobre fondos sólidos (el texto sobre fotos y en
// barras fijas se revisa a mano). Se ejecuta con «reducir movimiento» para que todo esté visible.
// Falsos positivos conocidos: enlaces dentro de frases (exentos en WCAG 2.2) y los títulos de las
// tarjetas compactas, cuyo enlace cubre toda la tarjeta.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BASE ?? "http://localhost:5201";
const navegador = [
  process.env.CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((c) => c && existsSync(c));
if (!navegador) {
  console.error("No se encuentra Chrome ni Edge. Indica la ruta con la variable CHROME.");
  process.exit(1);
}

const puerto = 9300 + Math.floor(Math.random() * 600);
const perfil = mkdtempSync(join(tmpdir(), "auditar-"));
const proceso = spawn(navegador, ["--headless=new", `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, "--no-first-run", "--mute-audio", "about:blank"], { stdio: "ignore" });
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
await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
// Sin banner de cookies (con todo rechazado), para no tapar el contenido.
await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `try { localStorage.setItem('um-consentimiento-v1', JSON.stringify({ analitica: false, marketing: false, fecha: '2026-01-01', version: 1 })); } catch {}` });

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const rutas = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
rutas.push("/aviso-legal", "/privacidad", "/cookies", "/condiciones", "/accesibilidad", "/creditos", "/no-existe");

const auditoria = `(async () => {
  await document.fonts.ready;
  // Termina las transiciones pendientes (sin fotogramas, Chrome sin interfaz puede dejarlas a medias).
  // En varias pasadas: al terminar la de un color heredado, los hijos empiezan la suya un nivel más abajo.
  for (let pasada = 0; pasada < 20; pasada++) {
    const vivas = document.getAnimations().filter((a) => a.playState !== 'finished' && a.effect?.getComputedTiming().endTime !== Infinity);
    if (!vivas.length) break;
    for (const a of vivas) { try { a.finish(); } catch {} }
  }
  const res = { seo: [], a11y: [], contraste: [], info: {} };
  const t = document.title, d = document.querySelector('meta[name=description]')?.content || '';
  res.info.title = t; res.info.description = d;
  if (t.length > 65) res.seo.push('título largo (' + t.length + ')');
  if (d.length < 70 || d.length > 165) res.seo.push('descripción ' + d.length + ' caracteres');
  const can = document.querySelector('link[rel=canonical]')?.href;
  if (!can && location.pathname !== '/no-existe') res.seo.push('sin canonical');
  if (can && location.pathname !== '/no-existe' && new URL(can).pathname.replace(/\\/$/, '') !== location.pathname.replace(/\\/$/, '')) res.seo.push('canonical distinto: ' + can);
  if (!document.querySelector('meta[property="og:image"]')) res.seo.push('sin og:image');
  if (!document.querySelector('meta[property="og:title"]')) res.seo.push('sin og:title');
  if (document.documentElement.lang !== 'es') res.seo.push('lang ' + document.documentElement.lang);
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) { try { JSON.parse(s.textContent); } catch { res.seo.push('JSON-LD inválido'); } }
  const h1 = document.querySelectorAll('h1'); if (h1.length !== 1) res.a11y.push(h1.length + ' h1');
  let prev = 0; for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { if (h.closest('[hidden],[aria-hidden=true]') || !h.offsetParent && getComputedStyle(h).position !== 'fixed') continue; const n = +h.tagName[1]; if (prev && n > prev + 1) res.a11y.push('salto ' + 'h' + prev + '→h' + n + ': ' + h.textContent.trim().slice(0, 40)); prev = n; }
  for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt')) res.a11y.push('img sin alt ' + img.src.slice(-40));
  const nombre = (el) => (el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent) || el.textContent || el.getAttribute('title') || [...el.querySelectorAll('img[alt]')].map(i => i.alt).join('') || '').trim();
  for (const el of document.querySelectorAll('a[href],button')) { if (el.closest('[aria-hidden=true]') || el.tabIndex < 0 && el.closest('[aria-hidden]')) continue; if (!nombre(el)) res.a11y.push('control sin nombre: ' + el.outerHTML.slice(0, 80)); }
  for (const f of document.querySelectorAll('input:not([type=hidden]),select,textarea')) { if (f.closest('[aria-hidden=true]')) continue; const ok = f.labels?.length || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby'); if (!ok) res.a11y.push('campo sin etiqueta: ' + (f.name || f.id)); }
  const ids = {}; for (const el of document.querySelectorAll('[id]')) ids[el.id] = (ids[el.id] || 0) + 1; for (const [k, v] of Object.entries(ids)) if (v > 1) res.a11y.push('id duplicado: ' + k);
  // Objetivos táctiles < 24 px (fuera de enlaces dentro de párrafos)
  for (const el of document.querySelectorAll('a[href],button,input,select,textarea,[role=button]')) {
    const r = el.getBoundingClientRect(); if (!r.width || el.closest('[aria-hidden=true]') || getComputedStyle(el).visibility === 'hidden') continue;
    // Exentos: enlaces dentro de una frase y enlaces cuyo ::after absoluto cubre toda la tarjeta.
    const frase = el.closest('p, li, dd, figcaption, small, td, label');
    const enTexto = el.tagName === 'A' && frase && frase.textContent.trim().length > el.textContent.trim().length + 3;
    const despues = getComputedStyle(el, '::after');
    if (despues.content !== 'none' && despues.position === 'absolute') continue;
    if (!enTexto && (r.width < 24 || r.height < 24) && !el.classList.contains('sr-only')) res.a11y.push('objetivo ' + Math.round(r.width) + '×' + Math.round(r.height) + ': ' + (nombre(el) || el.outerHTML.slice(0, 40)).slice(0, 40));
  }
  // Contraste de texto sobre fondos sólidos
  const rgba = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mezcla = (a, b) => [a[0] * a[3] + b[0] * (1 - a[3]), a[1] * a[3] + b[1] * (1 - a[3]), a[2] * a[3] + b[2] * (1 - a[3]), 1];
  const fondo = (el) => { const capas = []; for (let n = el; n; n = n.parentElement) { const s = getComputedStyle(n); if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return null; if (/gradient/.test(s.backgroundImage)) return null; const c = rgba(s.backgroundColor); if (c && c[3] > 0) { capas.push(c); if (c[3] >= 1) break; } if (n.tagName === 'IMG' || n.tagName === 'VIDEO') return null; } let col = [255, 255, 255, 1]; for (const c of capas.reverse()) col = mezcla(c, col); return col; };
  const vistos = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const tn = walker.currentNode; if (!tn.textContent.trim()) continue; const el = tn.parentElement; if (!el || vistos.has(el)) continue; vistos.add(el);
    if (el.closest('[aria-hidden=true],.sr-only,[hidden]')) continue;
    let fijo = false; for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') { fijo = true; break; }
    if (fijo) continue; // cabecera y barras fijas: su fondo real depende de lo que haya debajo
    const s = getComputedStyle(el); if (s.visibility === 'hidden' || +s.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    // ¿hay una imagen o vídeo debajo? (texto sobre foto: no se puede calcular)
    let sobreFoto = false; for (let n = el; n && n !== document.body; n = n.parentElement) { if (n.parentElement && [...n.parentElement.children].some(c => c !== n && c.querySelector && (c.matches('img,video') || c.querySelector(':scope > img, :scope > video, img, video')) && getComputedStyle(c).position === 'absolute')) { sobreFoto = true; break; } }
    if (sobreFoto) continue;
    const bg = fondo(el); if (!bg) continue;
    let fg = rgba(s.color); if (!fg) continue;
    let op = 1; for (let n = el; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
    fg = mezcla([fg[0], fg[1], fg[2], fg[3] * op], bg);
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const tam = parseFloat(s.fontSize), grueso = +s.fontWeight >= 700; const grande = tam >= 24 || (tam >= 18.66 && grueso);
    if (ratio < (grande ? 3 : 4.5)) res.contraste.push(ratio.toFixed(2) + ' ' + Math.round(tam) + 'px «' + tn.textContent.trim().slice(0, 35) + '» ' + String(el.className).slice(0, 40));
  }
  return res;
})()`;

for (const ancho of [1440, 390]) {
  await cdp("Emulation.setDeviceMetricsOverride", { width: ancho, height: 900, deviceScaleFactor: 1, mobile: ancho < 768 });
  const incidencias = new Map();
  const titulos = new Map();
  const descripciones = new Map();
  for (const ruta of rutas) {
    const cargado = new Promise((r) => { const f = (m) => { if (m.method === "Page.loadEventFired") { oyentes.delete(f); r(); } }; oyentes.add(f); });
    await cdp("Page.navigate", { url: base + ruta });
    await cargado;
    await esperar(800);
    const v = (await cdp("Runtime.evaluate", { returnByValue: true, awaitPromise: true, expression: auditoria })).result?.value;
    if (!v) { incidencias.set(`error al auditar`, [ruta]); continue; }
    titulos.set(v.info.title, [...(titulos.get(v.info.title) ?? []), ruta]);
    descripciones.set(v.info.description, [...(descripciones.get(v.info.description) ?? []), ruta]);
    for (const x of [...v.seo.map((s) => `SEO · ${s}`), ...v.a11y.map((s) => `Accesibilidad · ${s}`), ...v.contraste.map((s) => `Contraste · ${s}`)])
      incidencias.set(x, [...(incidencias.get(x) ?? []), ruta]);
  }
  for (const [t, rs] of titulos) if (rs.length > 1) incidencias.set(`SEO · título repetido: ${t}`, rs);
  for (const [d, rs] of descripciones) if (rs.length > 1) incidencias.set(`SEO · descripción repetida: ${d.slice(0, 60)}…`, rs);
  console.log(`\n${ancho} px · ${rutas.length} URL · ${incidencias.size} incidencias distintas`);
  for (const [x, rs] of incidencias) console.log(`  ${x}  (${rs.length}: ${rs.slice(0, 3).join(", ")}${rs.length > 3 ? "…" : ""})`);
}

ws.close();
proceso.kill();
await esperar(400);
try { rmSync(perfil, { recursive: true, force: true }); } catch {}
process.exit(0);
