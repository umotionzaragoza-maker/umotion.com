"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { Icono } from "@/components/ui/Icono";
import { negocio } from "@/data/negocio";
import { track } from "@/lib/analytics";
import { MOTIVOS, esquemaContacto } from "@/lib/contacto";

type Estado = "inicial" | "enviando" | "ok" | "error" | "no-configurado";

export function FormularioContacto() {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const inicio = useRef(Date.now());

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const datos = {
      nombre: String(f.get("nombre") ?? ""),
      email: String(f.get("email") ?? ""),
      telefono: String(f.get("telefono") ?? ""),
      motivo: String(f.get("motivo") ?? ""),
      mensaje: String(f.get("mensaje") ?? ""),
      privacidad: f.get("privacidad") === "on",
      web: String(f.get("web") ?? ""),
      t: inicio.current,
    };

    const r = esquemaContacto.safeParse(datos);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) {
        const campo = String(i.path[0]);
        if (errs[campo]) continue;
        errs[campo] = {
          nombre: "Dinos tu nombre.",
          email: "Indica un email válido o un teléfono.",
          telefono: "Revisa el teléfono.",
          motivo: "Elige un motivo.",
          mensaje: "Cuéntanos un poco más (mínimo 10 caracteres).",
          privacidad: "Necesitamos tu consentimiento para responderte.",
        }[campo] ?? "Revisa este campo.";
      }
      setErrores(errs);
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setErrores({});
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (res.ok) {
        setEstado("ok");
        track("contacto_enviado", { motivo: datos.motivo });
        return;
      }
      const cuerpo = (await res.json().catch(() => ({}))) as { error?: string };
      setEstado(cuerpo.error === "no-configurado" ? "no-configurado" : "error");
      track("contacto_error", { codigo: res.status });
    } catch {
      setEstado("error");
    }
  };

  if (estado === "ok") {
    return (
      <div className="py-6 text-center" role="status">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-amarillo text-tinta">
          <Icono nombre="check" className="size-7" />
        </span>
        <p className="t-h2 mt-6">Mensaje recibido.</p>
        <p className="mt-3 text-gris">Te respondemos lo antes posible. Si es urgente, escríbenos por WhatsApp.</p>
      </div>
    );
  }

  const campo = (nombre: string) => ({
    "aria-invalid": errores[nombre] ? true : undefined,
    "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
  });
  const Error = ({ n }: { n: string }) =>
    errores[n] ? (
      <p id={`error-${n}`} className="mt-1.5 text-sm font-medium text-[#b3261e]">
        {errores[n]}
      </p>
    ) : null;

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="c-motivo" className="mb-1.5 block text-sm font-semibold">
          ¿En qué te ayudamos?
        </label>
        <select id="c-motivo" name="motivo" className="campo" defaultValue={MOTIVOS[0]} {...campo("motivo")}>
          {MOTIVOS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="c-nombre" className="mb-1.5 block text-sm font-semibold">
          Nombre
        </label>
        <input id="c-nombre" name="nombre" className="campo" autoComplete="name" maxLength={80} required {...campo("nombre")} />
        <Error n="nombre" />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <input id="c-email" name="email" type="email" className="campo" autoComplete="email" maxLength={120} {...campo("email")} />
        <Error n="email" />
      </div>
      <div>
        <label htmlFor="c-telefono" className="mb-1.5 block text-sm font-semibold">
          Teléfono <span className="font-normal text-gris">(o email)</span>
        </label>
        <input id="c-telefono" name="telefono" type="tel" className="campo" autoComplete="tel" maxLength={20} {...campo("telefono")} />
        <Error n="telefono" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="c-mensaje" className="mb-1.5 block text-sm font-semibold">
          Mensaje
        </label>
        <textarea id="c-mensaje" name="mensaje" className="campo min-h-36 resize-y" maxLength={2000} required {...campo("mensaje")} />
        <Error n="mensaje" />
      </div>

      {/* Trampa para bots: invisible para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-web">No rellenes este campo</label>
        <input id="c-web" name="web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="privacidad" className="mt-0 size-6 shrink-0 accent-tinta" {...campo("privacidad")} />
          <span className="text-gris">
            He leído la <Link href="/privacidad" className="underline underline-offset-2">política de privacidad</Link> y acepto que
            usen mis datos solo para responder a este mensaje.
          </span>
        </label>
        <Error n="privacidad" />
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <button type="submit" className="btn" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
          <Icono nombre="flecha" className="flecha size-4" />
        </button>
        {estado === "error" && (
          <p className="text-sm font-medium text-[#b3261e]" role="alert">
            No hemos podido enviarlo. Inténtalo de nuevo o escríbenos por WhatsApp.
          </p>
        )}
        {estado === "no-configurado" && (
          <p className="text-sm" role="alert">
            El formulario aún no está activo.{" "}
            <AccionContacto tipo="whatsapp" origen="formulario-fallback" className="font-semibold underline underline-offset-2">
              Escríbenos por WhatsApp al {negocio.telefono.visible}
            </AccionContacto>
            .
          </p>
        )}
      </div>
    </form>
  );
}
