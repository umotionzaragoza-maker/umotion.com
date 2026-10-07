import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { migasJsonLd } from "@/lib/seo";

export type Miga = { nombre: string; ruta: string };

const COLOR = { oscuro: "text-crema/60", claro: "text-gris", amarillo: "text-tinta/80" } as const;

/** tono: color del fondo sobre el que va (sobre amarillo, el gris no llega a 4,5:1). */
export function Migas({ items, tono = "oscuro" }: { items: Miga[]; tono?: keyof typeof COLOR }) {
  const todas = [{ nombre: "Inicio", ruta: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className={`t-mono text-[0.8rem] ${COLOR[tono]}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {todas.map((m, i) => {
            const ultima = i === todas.length - 1;
            return (
              <li key={m.ruta} className="flex items-center gap-2">
                {ultima ? (
                  <span aria-current="page" className={tono === "oscuro" ? "text-crema" : "text-texto"}>
                    {m.nombre}
                  </span>
                ) : (
                  <>
                    <Link href={m.ruta} className="inline-flex min-h-6 items-center py-1 hover:underline">
                      {m.nombre}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={migasJsonLd(todas)} />
    </>
  );
}
