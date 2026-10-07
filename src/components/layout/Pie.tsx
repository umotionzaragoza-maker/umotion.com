import Link from "next/link";
import { BotonPreferencias } from "@/components/cookies/BotonPreferencias";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { Icono } from "@/components/ui/Icono";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { horarioLegible, negocio } from "@/data/negocio";
import { sectores } from "@/data/sectores";
import { Logo } from "./Logo";
import { navegacion } from "./navegacion";

export function Pie() {
  return (
    <footer data-tema="oscuro" className="oscuro relative overflow-hidden pb-[calc(var(--barra-movil)+2rem)] pt-[var(--seccion)]">
      <div className="marco">
        {/* Cierre comercial */}
        <div className="grid gap-10 border-b border-crema/12 pb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-eyebrow text-amarillo">¿Hablamos de tu negocio?</p>
            <p className="t-mega mt-5">
              Menos tareas.
              <br />
              <span className="italica text-amarillo">Más negocio.</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/diagnostico" className="btn btn-amarillo">
              Pide tu diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
            </Link>
            <AccionContacto tipo="whatsapp" origen="pie" className="btn btn-claro">
              <Icono nombre="whatsapp" /> WhatsApp
            </AccionContacto>
          </div>
        </div>

        <div className="grid gap-12 pb-4 pt-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo sobre="oscuro" className="h-8" />
            <p className="mt-5 max-w-xs leading-relaxed text-gris-claro">
              Webs, marketing y automatización con IA para negocios de {negocio.zona.ciudad}.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="t-eyebrow text-gris-claro">Dónde y cuándo</p>
            <ul className="mt-4 space-y-2 leading-relaxed">
              {negocio.zona.modalidades.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-[0.95rem]">
              {horarioLegible.map((h) => (
                <div key={h.dias} className="flex justify-between gap-4 border-b border-crema/10 pb-2">
                  <dt className="text-gris-claro">{h.dias}</dt>
                  <dd className="t-num text-right">{h.horas}</dd>
                </div>
              ))}
            </dl>
            <EstadoAbierto variante="largo" className="mt-3 text-sm text-gris-claro" />
            <AccionContacto tipo="llamar" origen="pie" className="enlace mt-5 text-amarillo">
              <Icono nombre="telefono" className="size-4" /> {negocio.telefono.visible}
            </AccionContacto>
            <AccionContacto tipo="email" origen="pie" className="enlace mt-3 break-all text-amarillo">
              <Icono nombre="mail" className="size-4 shrink-0" /> {negocio.email}
            </AccionContacto>
          </div>

          <nav aria-label="Ejemplos por sector" className="lg:col-span-2">
            <p className="t-eyebrow text-gris-claro">Para</p>
            <ul className="mt-4 space-y-2.5">
              {sectores.map((s) => (
                <li key={s.id}>
                  <Link href={`/ejemplos#${s.id}`} className="inline-flex min-h-6 items-center hover:text-amarillo">
                    {s.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Umotion" className="lg:col-span-3">
            <p className="t-eyebrow text-gris-claro">Umotion</p>
            <ul className="mt-4 space-y-2.5">
              {navegacion.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-6 items-center hover:text-amarillo">
                    {n.etiqueta}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/diagnostico" className="inline-flex min-h-6 items-center hover:text-amarillo">
                  Diagnóstico gratuito
                </Link>
              </li>
            </ul>
          </nav>
        </div>


        <div className="mt-14 flex flex-col gap-4 border-t border-crema/12 pt-6 text-[0.82rem] text-gris-claro md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {negocio.nombreLegible} · {negocio.zona.ciudad}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/aviso-legal" className="inline-flex min-h-6 items-center hover:text-crema">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="inline-flex min-h-6 items-center hover:text-crema">Privacidad</Link></li>
            <li><Link href="/cookies" className="inline-flex min-h-6 items-center hover:text-crema">Cookies</Link></li>
            <li><Link href="/condiciones" className="inline-flex min-h-6 items-center hover:text-crema">Condiciones</Link></li>
            <li><Link href="/accesibilidad" className="inline-flex min-h-6 items-center hover:text-crema">Accesibilidad</Link></li>
            <li><Link href="/creditos" className="inline-flex min-h-6 items-center hover:text-crema">Créditos de imagen</Link></li>
            <li><BotonPreferencias className="inline-flex min-h-6 items-center hover:text-crema" /></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
