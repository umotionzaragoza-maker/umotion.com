"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { consentimiento, useConsentimiento } from "@/lib/consent";

export function BannerCookies() {
  const { valor, decidido, panel } = useConsentimiento();
  const [config, setConfig] = useState(false);
  const [analitica, setAnalitica] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const idTitulo = useId();

  useEffect(() => {
    if (panel) {
      setConfig(true);
      setAnalitica(valor?.analitica ?? false);
      setMarketing(valor?.marketing ?? false);
    }
  }, [panel, valor]);

  if (decidido && !panel) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={idTitulo}
      className="fixed inset-x-3 bottom-[calc(var(--barra-movil)+0.75rem)] z-[55] mx-auto max-w-xl animate-subir rounded-2xl bg-crema p-5 text-texto md:p-6 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)] ring-1 ring-tinta/10 md:inset-x-auto md:left-6 md:bottom-6"
    >
      <p id={idTitulo} className="t-h3 max-md:text-[1.2rem]">
        Cookies, las justas.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gris md:text-[0.95rem]">
        Usamos solo lo imprescindible para que la web funcione y contamos las visitas sin cookies. Si nos
        dejas, mediremos con más detalle para mejorarla. Nada más. <Link href="/cookies" className="underline underline-offset-2">Más información</Link>.
      </p>

      {config && (
        <fieldset className="mt-5 space-y-3 border-t border-tinta/10 pt-5">
          <legend className="sr-only">Tipos de cookies</legend>
          <label className="flex items-start justify-between gap-4">
            <span>
              <span className="font-semibold">Técnicas</span>
              <span className="block text-sm text-gris">Preferencias y seguridad. Siempre activas.</span>
            </span>
            <input type="checkbox" checked disabled className="mt-1 size-5 accent-tinta" />
          </label>
          <label className="flex items-start justify-between gap-4">
            <span>
              <span className="font-semibold">Analítica</span>
              <span className="block text-sm text-gris">Visitas y uso de la web, de forma agregada.</span>
            </span>
            <input type="checkbox" checked={analitica} onChange={(e) => setAnalitica(e.target.checked)} className="mt-1 size-5 accent-tinta" />
          </label>
          <label className="flex items-start justify-between gap-4">
            <span>
              <span className="font-semibold">Publicidad</span>
              <span className="block text-sm text-gris">Medir campañas en redes sociales.</span>
            </span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 size-5 accent-tinta" />
          </label>
        </fieldset>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6">
        <button type="button" className="btn btn-contorno btn-sm" onClick={() => consentimiento.guardar(false, false)}>
          Rechazar
        </button>
        <button type="button" className="btn btn-sm" onClick={() => consentimiento.guardar(true, true)}>
          Aceptar
        </button>
        {config ? (
          <button type="button" className="col-span-2 min-h-10 text-sm font-semibold underline underline-offset-4 md:min-h-11" onClick={() => consentimiento.guardar(analitica, marketing)}>
            Guardar mi selección
          </button>
        ) : (
          <button type="button" className="col-span-2 min-h-10 text-sm font-semibold underline underline-offset-4 md:min-h-11" onClick={() => setConfig(true)}>
            Configurar
          </button>
        )}
      </div>
    </div>
  );
}
