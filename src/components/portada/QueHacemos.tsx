import Link from "next/link";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { familias, serviciosDe, type FamiliaId } from "@/data/servicios";

const icono: Record<FamiliaId, NombreIcono> = { analisis: "radar", presencia: "pantalla", automatizacion: "repetir" };

/** 01 — Qué hacemos: las tres familias de servicios de un vistazo, cada una enlazada a su bloque en /servicios. */
export function QueHacemos() {
  return (
    <section data-tema="claro" className="bg-crema" aria-labelledby="titulo-que-hacemos">
      <div className="marco seccion">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-etiqueta text-amarillo-hondo">01 · Qué hacemos</p>
            <h2 id="titulo-que-hacemos" className="t-display mt-5 max-w-[16ch]">
              Entender, atraer, automatizar. <span className="text-niebla">En el orden que necesites.</span>
            </h2>
          </div>
          <p className="max-w-md text-gris lg:col-span-5 lg:justify-self-end">
            No hace falta contratarlo todo. En el diagnóstico vemos qué te aporta más y empezamos por ahí.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 lg:grid-cols-3" data-reveal="linea">
          {familias.map((f, i) => (
            <li key={f.id}>
              <Link
                href={`/servicios#${f.id}`}
                className="group flex h-full flex-col rounded-3xl border border-tinta/10 bg-papel p-7 transition-colors hover:border-tinta/30"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-tinta text-amarillo">
                    <Icono nombre={icono[f.id]} className="size-5" />
                  </span>
                  <span className="t-mono text-[0.85rem] text-gris">{String(i + 1).padStart(2, "0")} / 03</span>
                </div>
                <p className="t-etiqueta mt-10 text-amarillo-hondo">{f.corto}</p>
                <h3 className="t-h3 mt-2">{f.nombre}</h3>
                <p className="mt-3 flex-1 text-[0.97rem] text-gris">{f.texto}</p>
                <ul className="mt-6 space-y-2 border-t border-tinta/10 pt-5 text-[0.93rem] font-medium">
                  {serviciosDe(f.id).map((s) => (
                    <li key={s.slug} className="flex items-center justify-between gap-3">
                      {s.nombre}
                      {s.precio === "gratis" && <span className="chip t-etiqueta bg-amarillo text-tinta">Gratis</span>}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                  Ver detalle
                  <Icono nombre="flecha" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
