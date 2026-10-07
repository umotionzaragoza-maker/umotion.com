// Resuelve los alias "@/..." (tsconfig) y las importaciones relativas sin extensión,
// para ejecutar las pruebas con Node sin dependencias.
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const candidatos = (base) => [`${base}.ts`, `${base}.tsx`, join(base, "index.ts"), base];

export async function resolve(especificador, contexto, siguiente) {
  let base = null;
  if (especificador.startsWith("@/")) base = join(src, especificador.slice(2));
  else if (/^\.\.?\//.test(especificador) && contexto.parentURL?.startsWith("file:")) {
    base = join(dirname(fileURLToPath(contexto.parentURL)), especificador);
  }
  if (base) {
    const hallado = candidatos(base).find((c) => existsSync(c) && /\.(ts|tsx|mjs|js)$/.test(c));
    if (hallado) return siguiente(pathToFileURL(hallado).href, contexto);
  }
  return siguiente(especificador, contexto);
}
