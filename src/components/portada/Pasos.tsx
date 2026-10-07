import Link from "next/link";
import { Icono } from "@/components/ui/Icono";
import { pasos } from "@/data/metodo";

/** 02 — Cómo trabajamos: cuatro pasos en una línea, el primero marcado como gratis. */
export function Pasos() {
  return (
    <section data-tema="claro" className="bg-crema" aria-labelledby="titulo-pasos">
      <div className="marco seccion">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-etiqueta text-amarillo-hondo">03 · Cómo trabajamos</p>
            <h2 id="titulo-pasos" className="t-display mt-5">
              Cuatro pasos. <span className="text-niebla">El primero es gratis.</span>
            </h2>
          </div>
          <Link href="/metodo" className="enlace">
            El método en detalle
            <Icono nombre="flecha" className="size-4" />
          </Link>
        </div>

        <ol className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-reveal="linea">
          {pasos.map((p, i) => {
            const primero = i === 0;
            return (
              <li
                key={p.titulo}
                className={`relative flex flex-col rounded-3xl p-7 ${
                  primero ? "bg-tinta text-crema shadow-[0_30px_60px_-30px_rgb(43_82_240/0.55)]" : "border border-tinta/10 bg-papel"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`t-mono text-[0.85rem] ${primero ? "text-amarillo" : "text-gris"}`}>
                    {String(i + 1).padStart(2, "0")} / 04
                  </span>
                  {primero && <span className="chip t-etiqueta bg-amarillo text-tinta">Gratis</span>}
                </div>
                <h3 className="t-h3 mt-6 md:mt-10">{p.titulo}</h3>
                <p className={`mt-3 flex-1 text-[0.97rem] ${primero ? "text-crema/70" : "text-gris"}`}>{p.texto}</p>
                <p className={`mt-6 flex items-start gap-2 border-t pt-5 text-[0.88rem] font-medium ${primero ? "border-crema/10" : "border-tinta/10"}`}>
                  <Icono nombre="check" className={`mt-0.5 size-4 shrink-0 ${primero ? "text-amarillo" : "text-amarillo-hondo"}`} />
                  {p.resultado}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
