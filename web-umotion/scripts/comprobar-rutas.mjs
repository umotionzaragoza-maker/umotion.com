// Comprueba que todas las rutas públicas responden como se espera.
// Uso: node scripts/comprobar-rutas.mjs [http://localhost:5200]
const base = process.argv[2] ?? "http://localhost:5200";

const esperadas = [
  "/", "/servicios", "/ejemplos", "/metodo", "/diagnostico", "/nosotros", "/contacto",
  "/aviso-legal", "/privacidad", "/cookies", "/condiciones", "/accesibilidad", "/creditos",
  "/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/icon.png", "/apple-icon", "/opengraph-image",
];
const extra = [];
const redirecciones = [
  ["/diagnostico-gratis", "/diagnostico"],
  ["/servicio", "/servicios"],
  ["/sobre-nosotros", "/nosotros"],
  ["/como-trabajamos", "/metodo"],
];

let fallos = 0;
const ok = async (ruta, esperado = 200) => {
  const r = await fetch(base + ruta, { redirect: "manual" });
  const bien = r.status === esperado;
  if (!bien) fallos++;
  console.log(`${bien ? "OK " : "ERR"} ${r.status} ${ruta}`);
  return r;
};

for (const r of [...esperadas, ...extra]) await ok(r);
await ok("/esta-pagina-no-existe", 404);
await ok("/servicios/no-existe", 404);
for (const [de, a] of redirecciones) {
  const r = await fetch(base + de, { redirect: "manual" });
  const loc = r.headers.get("location") ?? "";
  const bien = [301, 307, 308].includes(r.status) && loc.endsWith(a);
  if (!bien) fallos++;
  console.log(`${bien ? "OK " : "ERR"} ${r.status} ${de} -> ${loc}`);
}
console.log(`\n${esperadas.length + extra.length + 2 + redirecciones.length} comprobaciones, ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
