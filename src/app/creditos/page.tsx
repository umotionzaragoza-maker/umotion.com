import type { Metadata } from "next";
import Image from "next/image";
import { PaginaLegal } from "@/components/legal/PaginaLegal";
import { creditos } from "@/data/creditos";
import { fotos, type FotoKey } from "@/lib/fotos";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Créditos de imagen",
  descripcion: "Procedencia de las imágenes de la web de Umotion: ilustraciones de marca hechas para Umotion, sin fotografías de banco de imágenes.",
  ruta: "/creditos",
  indexar: false,
});

export default function Creditos() {
  const entradas = Object.entries(creditos) as [FotoKey, (typeof creditos)[FotoKey]][];

  return (
    <PaginaLegal titulo="Créditos de imagen" ruta="/creditos" borrador={false}>
      <p>
        Todas las imágenes de esta web son <strong>ilustraciones de marca</strong> hechas para Umotion con los colores de su logotipo.
        No son fotografías y no muestran clientes, personas ni trabajos reales: representan ideas (una automatización, un diagnóstico,
        un negocio que crece).
      </p>
      <h2>Ilustraciones</h2>
      <ul className="!mt-6 grid gap-4 sm:grid-cols-2">
        {entradas.map(([k, c]) => (
          <li key={k} className="!ml-0 flex !list-none items-center gap-4">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-tinta">
              <Image src={fotos[k]} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <span className="text-sm">
              <span className="block font-semibold text-texto">{c.descripcion}</span>
              {c.autor} · {c.fuente} · {c.licencia}
            </span>
          </li>
        ))}
      </ul>
    </PaginaLegal>
  );
}
