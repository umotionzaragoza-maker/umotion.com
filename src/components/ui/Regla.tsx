import type { Regla as TRegla } from "@/data/sectores";

/**
 * La seña de Umotion: una automatización escrita como regla, «Cuando… → Entonces…».
 * Es el objeto del oficio (como la etiqueta de precio en un mercado): se usa en la portada,
 * en /ejemplos y en /servicios para que cada idea se entienda sin tecnicismos.
 */
export function Regla({ regla, tono = "oscuro", numero }: { regla: TRegla; tono?: "oscuro" | "claro"; numero?: number }) {
  const oscuro = tono === "oscuro";
  return (
    <div
      className={`relative flex h-full flex-col rounded-[1.4rem] p-5 md:p-6 ${
        oscuro ? "bg-carbon text-crema ring-1 ring-crema/10" : "bg-crema text-texto ring-1 ring-tinta/10"
      }`}
    >
      {numero !== undefined && (
        <span className={`t-num absolute right-5 top-5 text-xs ${oscuro ? "text-crema/45" : "text-gris"}`} aria-hidden="true">
          {String(numero).padStart(2, "0")}
        </span>
      )}
      <p className={`t-eyebrow ${oscuro ? "text-amarillo" : "text-amarillo-hondo"}`}>Cuando</p>
      <p className="mt-2 pr-6 font-semibold leading-snug">{regla.cuando}</p>
      <div className="my-3 flex items-center gap-3" aria-hidden="true">
        <span className="regla-conector ml-2 h-7" />
      </div>
      <p className={`t-eyebrow ${oscuro ? "text-amarillo" : "text-amarillo-hondo"}`}>Entonces</p>
      <p className={`mt-2 leading-snug ${oscuro ? "text-crema/80" : "text-gris"}`}>{regla.entonces}</p>
    </div>
  );
}
