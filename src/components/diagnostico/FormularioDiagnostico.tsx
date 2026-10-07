"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { Icono } from "@/components/ui/Icono";
import { enlaces, negocio } from "@/data/negocio";
import { track } from "@/lib/analytics";
import {
  FRANJAS,
  MODALIDADES,
  SECTORES,
  TAREAS,
  esquemaDiagnostico,
  mensajeDiagnostico,
  nuevoNumeroSolicitud,
  type SolicitudDiagnostico,
} from "@/lib/diagnostico";

type Enviada = { numero: string; enlace: string };

const MENSAJES: Record<string, string> = {
  nombre: "Dinos tu nombre.",
  sector: "Elige el tipo de negocio.",
  telefono: "Revisa el teléfono (o déjalo vacío).",
  privacidad: "Necesitamos tu consentimiento para atender la solicitud.",
};

/**
 * Solicitud del diagnóstico gratuito. Cuatro bloques cortos y un único campo obligatorio (el nombre):
 * al enviar se abre WhatsApp con la solicitud ya redactada y, si la hoja está conectada, se anota
 * también allí con el mismo número (D-AAMMDD-XXXX) para casar el chat con la fila.
 */
type Resumen = { sector: string; tareas: number; modalidad: string; franja: string };
const RESUMEN_INICIAL: Resumen = { sector: SECTORES[0], tareas: 0, modalidad: MODALIDADES[0], franja: FRANJAS[FRANJAS.length - 1] ?? "" };

/** Número provisional que se ve en el resumen antes de enviar (el definitivo se crea al enviar). */
const prefijoHoy = () => nuevoNumeroSolicitud().slice(0, 9) + "····";

const despues = [
  { titulo: "Te respondemos", texto: "Para acordar día y forma, dentro del horario de atención." },
  { titulo: "Hacemos el diagnóstico", texto: "En tu negocio o por videollamada. Nos enseñas cómo trabajas." },
  { titulo: "Te decimos por dónde empezar", texto: "Y, si quieres seguir, con precio claro antes de empezar." },
];

export function FormularioDiagnostico() {
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [resumen, setResumen] = useState<Resumen>(RESUMEN_INICIAL);
  const [prefijo] = useState(prefijoHoy);

  const alCambiar = (e: FormEvent<HTMLFormElement>) => {
    const f = new FormData(e.currentTarget);
    setResumen({
      sector: String(f.get("sector") ?? RESUMEN_INICIAL.sector),
      tareas: f.getAll("tareas").length,
      modalidad: String(f.get("modalidad") ?? RESUMEN_INICIAL.modalidad),
      franja: String(f.get("franja") ?? RESUMEN_INICIAL.franja),
    });
  };
  const [enviada, setEnviada] = useState<Enviada | null>(null);
  const inicio = useRef(Date.now());
  const empezado = useRef(false);

  const alEmpezar = () => {
    if (empezado.current) return;
    empezado.current = true;
    track("form_start", { origen: "diagnostico" });
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const datos = {
      numero: nuevoNumeroSolicitud(),
      nombre: String(f.get("nombre") ?? ""),
      negocio: String(f.get("negocio") ?? ""),
      sector: String(f.get("sector") ?? ""),
      tareas: f.getAll("tareas").map(String),
      detalle: String(f.get("detalle") ?? ""),
      modalidad: String(f.get("modalidad") ?? ""),
      franja: String(f.get("franja") ?? ""),
      telefono: String(f.get("telefono") ?? ""),
      privacidad: f.get("privacidad") === "on",
      web: String(f.get("web") ?? ""),
      t: inicio.current,
    };

    const r = esquemaDiagnostico.safeParse(datos);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) {
        const campo = String(i.path[0]);
        if (!errs[campo]) errs[campo] = MENSAJES[campo] ?? "Revisa este campo.";
      }
      setErrores(errs);
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setErrores({});
    const d: SolicitudDiagnostico = r.data;

    // Copia ordenada en la hoja del negocio (si está conectada). No bloquea: WhatsApp es el canal.
    void fetch("/api/diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      keepalive: true,
    }).catch(() => {});

    track("generate_lead", { origen: "diagnostico", sector: d.sector, modalidad: d.modalidad, tareas: d.tareas.length });
    const enlace = enlaces.whatsapp(mensajeDiagnostico(d));
    window.open(enlace, "_blank", "noopener,noreferrer");
    setEnviada({ numero: d.numero, enlace });
  };

  if (enviada) {
    return (
      <div className="rounded-[1.75rem] bg-crema p-8 text-center ring-1 ring-tinta/10 md:p-12" role="status">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-amarillo text-tinta">
          <Icono nombre="whatsapp" className="size-7" />
        </span>
        <p className="t-h2 mt-6">Ya casi está.</p>
        <p className="mx-auto mt-3 max-w-md text-gris">
          Se ha abierto WhatsApp con tu solicitud escrita. <strong className="text-texto">Solo falta que pulses enviar.</strong> Te
          respondemos para acordar día y forma.
        </p>
        <p className="mt-4 text-sm text-gris">
          Número de solicitud: <span className="t-num font-semibold text-texto">{enviada.numero}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={enviada.enlace} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <Icono nombre="whatsapp" /> Abrir WhatsApp otra vez
          </a>
          <Link href="/ejemplos" className="btn btn-contorno">
            Mientras, ver ejemplos
          </Link>
        </div>
      </div>
    );
  }

  const campo = (nombre: string) => ({
    "aria-invalid": errores[nombre] ? true : undefined,
    "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
  });
  const Error = ({ n }: { n: string }) =>
    errores[n] ? (
      <p id={`error-${n}`} className="mt-2 text-sm font-medium text-[#b3261e]">
        {errores[n]}
      </p>
    ) : null;

  const foco = "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tinta";
  const pastilla = `relative inline-flex min-h-12 cursor-pointer items-center rounded-full border border-tinta/20 px-5 text-[0.95rem] font-semibold transition-colors hover:border-tinta/50 has-[:checked]:border-tinta has-[:checked]:bg-tinta has-[:checked]:text-crema ${foco}`;
  const casilla = `group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-tinta/15 px-4 py-3 text-[0.95rem] transition-colors hover:border-tinta/40 has-[:checked]:border-tinta has-[:checked]:bg-papel has-[:checked]:font-semibold ${foco}`;
  const oculto = "absolute inset-0 cursor-pointer opacity-0";
  const bloque = "grid gap-5 rounded-3xl border border-tinta/10 bg-crema p-6 md:p-8";
  const leyenda = "t-etiqueta float-left w-full text-amarillo-hondo";
  const pregunta = "clear-both text-[1.35rem] font-semibold leading-snug tracking-[-0.02em]";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
    <form onSubmit={enviar} onFocus={alEmpezar} onChange={alCambiar} noValidate className="grid gap-4 lg:col-span-7">
      <fieldset className={bloque}>
        <legend className={leyenda}>01 · Tu negocio</legend>
        <p className={pregunta}>¿Qué tipo de negocio tienes?</p>
        <div role="radiogroup" aria-label="Tipo de negocio" className="flex flex-wrap gap-2" {...campo("sector")}>
          {SECTORES.map((s, i) => (
            <label key={s} className={pastilla}>
              <input type="radio" name="sector" value={s} defaultChecked={i === 0} className={oculto} />
              {s}
            </label>
          ))}
        </div>
        <Error n="sector" />
        <div>
          <label htmlFor="d-negocio" className="mb-1.5 block text-sm font-semibold">
            Nombre del negocio <span className="font-normal text-gris">(opcional)</span>
          </label>
          <input id="d-negocio" name="negocio" className="campo" autoComplete="organization" maxLength={120} />
        </div>
      </fieldset>

      <fieldset className={bloque}>
        <legend className={leyenda}>02 · Lo que quieres mejorar</legend>
        <p className={pregunta}>
          ¿En qué te gustaría que te ayudemos? <span className="text-base font-normal text-gris">Marca las que quieras.</span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {TAREAS.map((t) => (
            <label key={t} className={casilla}>
              <input type="checkbox" name="tareas" value={t} className={`peer ${oculto}`} />
              <span
                className="grid size-[22px] shrink-0 place-items-center rounded-md border-[1.5px] border-tinta/30 text-amarillo peer-checked:border-tinta peer-checked:bg-tinta [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                aria-hidden="true"
              >
                <Icono nombre="check" className="size-3.5" strokeWidth={2.4} />
              </span>
              {t}
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="d-detalle" className="mb-1.5 block text-sm font-semibold">
            Cuéntanos un poco más <span className="font-normal text-gris">(opcional)</span>
          </label>
          <textarea
            id="d-detalle"
            name="detalle"
            className="campo min-h-28 resize-y"
            maxLength={1000}
            placeholder="Por ejemplo: cada día paso a mano las reservas de WhatsApp a la libreta."
          />
        </div>
      </fieldset>

      <fieldset className={bloque}>
        <legend className={leyenda}>03 · Cómo y cuándo</legend>
        <p className={pregunta}>¿Dónde prefieres el diagnóstico?</p>
        <div role="radiogroup" aria-label="Dónde hacemos el diagnóstico" className="flex flex-wrap gap-2">
          {MODALIDADES.map((m, i) => (
            <label key={m} className={pastilla}>
              <input type="radio" name="modalidad" value={m} defaultChecked={i === 0} className={oculto} />
              {m}
            </label>
          ))}
        </div>
        <p className="mt-2 font-semibold">¿Mejor por la mañana o por la tarde?</p>
        <div role="radiogroup" aria-label="Qué momento del día te va mejor" className="flex flex-wrap gap-2">
          {FRANJAS.map((m, i) => (
            <label key={m} className={pastilla}>
              <input type="radio" name="franja" value={m} defaultChecked={i === FRANJAS.length - 1} className={oculto} />
              {m}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={bloque}>
        <legend className={leyenda}>04 · Tus datos</legend>
        <div className="clear-both grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="d-nombre" className="mb-1.5 block text-sm font-semibold">
              Tu nombre
            </label>
            <input id="d-nombre" name="nombre" className="campo" autoComplete="name" maxLength={80} required {...campo("nombre")} />
            <Error n="nombre" />
          </div>
          <div>
            <label htmlFor="d-telefono" className="mb-1.5 block text-sm font-semibold">
              Teléfono <span className="font-normal text-gris">(si prefieres que te llamemos)</span>
            </label>
            <input id="d-telefono" name="telefono" type="tel" className="campo" autoComplete="tel" maxLength={20} {...campo("telefono")} />
            <Error n="telefono" />
          </div>
        </div>

        {/* Trampa para bots: invisible para personas y lectores de pantalla */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="d-web">No rellenes este campo</label>
          <input id="d-web" name="web" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="privacidad" className="mt-0 size-6 shrink-0 accent-tinta" {...campo("privacidad")} />
            <span className="text-gris">
              He leído la{" "}
              <Link href="/privacidad" className="underline underline-offset-2">
                política de privacidad
              </Link>{" "}
              y acepto que {negocio.nombre} use estos datos solo para atender mi solicitud.
            </span>
          </label>
          <Error n="privacidad" />
        </div>
        <div>
          <button type="submit" className="btn">
            <Icono nombre="whatsapp" /> Enviar por WhatsApp
          </button>
          <p className="mt-3 text-sm text-gris">
            Se abrirá WhatsApp con tu solicitud escrita. ¿Prefieres llamar?{" "}
            <AccionContacto tipo="llamar" origen="diagnostico" className="font-semibold text-texto underline underline-offset-2">
              {negocio.telefono.visible}
            </AccionContacto>
            , de lunes a sábado de 9:00 a 20:00.
          </p>
        </div>
      </fieldset>
    </form>

    <aside className="grid gap-4 lg:sticky lg:top-[calc(var(--cabecera)+1.5rem)] lg:col-span-5" aria-label="Resumen de tu solicitud">
      <div className="panel rejilla-puntos-oscura p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">Tu solicitud</p>
          <p className="t-mono text-[0.8rem] text-amarillo">{prefijo}</p>
        </div>
        <dl className="mt-5 grid gap-3.5 text-[0.93rem]" aria-live="polite">
          {[
            ["Negocio", resumen.sector],
            ["Ayuda", resumen.tareas ? `${resumen.tareas} ${resumen.tareas === 1 ? "marcada" : "marcadas"}` : "Ninguna aún"],
            ["Dónde", resumen.modalidad],
            ["Cuándo", resumen.franja],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-crema/[0.08] pb-3.5 last:border-0 last:pb-0">
              <dt className="t-etiqueta pt-0.5 text-gris-claro">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.85rem] text-crema/60">Este mismo número aparece en tu mensaje de WhatsApp para que no se pierda nada.</p>
      </div>
      <div className="rounded-3xl border border-tinta/10 bg-crema p-7">
        <p className="t-etiqueta text-gris">Qué pasa después</p>
        <ol className="mt-5 grid gap-4">
          {despues.map((d, i) => (
            <li key={d.titulo} className="flex gap-3.5">
              <span className="t-mono text-amarillo-hondo">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-semibold">{d.titulo}</span>
                <span className="block text-[0.93rem] text-gris">{d.texto}</span>
              </span>
            </li>
          ))}
        </ol>
        <EstadoAbierto variante="largo" className="mt-5 text-sm text-gris" />
      </div>
    </aside>
    </div>
  );
}
