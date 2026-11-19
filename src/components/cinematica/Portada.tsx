import Link from "next/link";
import { AccionContacto } from "@/components/ui/AccionContacto";
import { EstadoAbierto } from "@/components/ui/EstadoAbierto";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { faq } from "@/data/faq";
import { capitulos, dudasCierre, problemas, remateProblema, type BloqueId } from "@/data/guion";
import { pasos, pilares } from "@/data/metodo";
import { negocio } from "@/data/negocio";
import { serviciosDe } from "@/data/servicios";
import "@/app/cinematica.css";
import { Capitulo } from "./Capitulo";
import { cursivaCine } from "./fuente";
import { IndiceCapitulos } from "./IndiceCapitulos";
import { Lienzo } from "./Lienzo";
import { SelectorSectores } from "./SelectorSectores";

const BotonDiagnostico = ({ origen, texto = "Pide tu diagnóstico gratis" }: { origen: string; texto?: string }) => (
  <Link href="/diagnostico" className="cine-boton" data-origen={origen}>
    {texto}
    <Icono nombre="flechaArriba" className="size-4" />
  </Link>
);

const EnlaceFlecha = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="cine-enlace">
    {children}
    <Icono nombre="flechaArriba" className="size-3.5" />
  </Link>
);

/** Acción bajo el texto de cada capítulo. */
const acciones: Partial<Record<BloqueId, React.ReactNode>> = {
  inicio: (
    <div className="mt-8 flex flex-col items-start gap-5">
      <BotonDiagnostico origen="portada-inicio" />
      <AccionContacto tipo="whatsapp" origen="portada-inicio" className="cine-enlace">
        <Icono nombre="whatsapp" className="size-4" />
        Escríbenos por WhatsApp
      </AccionContacto>
    </div>
  ),
  presencia: (
    <div className="mt-8">
      <EnlaceFlecha href="/servicios">Ver todos los servicios</EnlaceFlecha>
    </div>
  ),
  automatizacion: (
    <div className="mt-8">
      <EnlaceFlecha href="/ejemplos">Ver más ejemplos</EnlaceFlecha>
    </div>
  ),
  analisis: (
    <div className="mt-8">
      <EnlaceFlecha href="/metodo">Cómo trabajamos</EnlaceFlecha>
    </div>
  ),
  cierre: (
    <div className="mt-8">
      <BotonDiagnostico origen="portada-cierre" />
    </div>
  ),
};

function Tarjetas({ familia }: { familia: "presencia" | "analisis" }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {serviciosDe(familia).map((s) => (
        <li key={s.slug} className="cine-vidrio cine-tarjeta">
          <Icono nombre={s.icono as NombreIcono} className="size-6 text-amarillo" />
          <h3 className="t-h3 mt-6 text-crema">{s.nombre}</h3>
          <p className="mt-2 text-crema/85">{s.titular}</p>
          <ul className="mt-5 space-y-2 border-t border-crema/10 pt-5 text-[0.92rem] text-gris-claro">
            {s.ejemplos.map((e) => (
              <li key={e} className="flex gap-2">
                <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-amarillo" aria-hidden="true" />
                {e}
              </li>
            ))}
          </ul>
          {s.precio === "gratis" && <p className="t-etiqueta mt-5 text-amarillo">Gratis</p>}
        </li>
      ))}
    </ul>
  );
}

/** Contenido propio de cada capítulo, bajo su pantalla de titular. */
function Bloque({ id }: { id: BloqueId }) {
  switch (id) {
    case "inicio":
      return (
        <dl className="cine-datos">
          <div>
            <dt className="t-etiqueta">Primer paso</dt>
            <dd>Diagnóstico gratuito</dd>
          </div>
          <div>
            <dt className="t-etiqueta">Dónde</dt>
            <dd>En tu negocio o por videollamada</dd>
          </div>
          <div>
            <dt className="t-etiqueta">Ahora</dt>
            <dd>
              <EstadoAbierto />
            </dd>
          </div>
          <div className="cine-desliza" aria-hidden="true">
            <span className="t-etiqueta">Desliza</span>
            <span className="cine-desliza-linea" />
          </div>
        </dl>
      );
    case "problema":
      return (
        <div>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {problemas.map((p, i) => (
              <li key={p.sector} className="cine-vidrio cine-tarjeta" data-reveal data-delay={i * 0.08}>
                <span className="t-etiqueta text-amarillo">
                  {String(i + 1).padStart(2, "0")} · {p.sector}
                </span>
                <p className="mt-4 text-[1.08rem] leading-snug text-crema">{p.texto}</p>
              </li>
            ))}
          </ol>
          <p className="cine-remate" data-reveal>
            {remateProblema}
          </p>
        </div>
      );
    case "presencia":
      return <Tarjetas familia="presencia" />;
    case "automatizacion":
      return <SelectorSectores />;
    case "analisis":
      return (
        <div className="grid gap-10">
          <Tarjetas familia="analisis" />
          <ul className="grid gap-px overflow-hidden rounded-[1.25rem] border border-crema/10 sm:grid-cols-2 lg:grid-cols-4">
            {pilares.map((p) => (
              <li key={p.titulo} className="bg-noche/60 p-6 backdrop-blur-md">
                <p className="font-semibold text-crema">{p.titulo}</p>
                <p className="mt-2 text-[0.92rem] text-gris-claro">{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    case "cierre": {
      const dudas = faq.filter((f) => (dudasCierre as readonly string[]).includes(f.p));
      return (
        <div className="grid gap-12">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="cine-vidrio cine-tarjeta" data-reveal data-delay={i * 0.08}>
                <span className="t-etiqueta text-amarillo">Paso {String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-4 text-crema">{p.titulo}</h3>
                <p className="mt-2 text-[0.94rem] text-gris-claro">{p.texto}</p>
                <p className="mt-4 border-t border-crema/10 pt-4 text-[0.92rem] text-crema">{p.resultado}</p>
              </li>
            ))}
          </ol>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="t-etiqueta text-amarillo">Dudas rápidas</p>
              <p className="t-h2 mt-3 text-crema">Antes de que lo preguntes.</p>
              <div className="mt-5">
                <EnlaceFlecha href="/contacto">Más preguntas</EnlaceFlecha>
              </div>
            </div>
            <div className="cine-vidrio px-6 py-2 md:px-8 lg:col-span-8">
              {dudas.map((d) => (
                <details key={d.p} className="cine-duda">
                  <summary>
                    {d.p}
                    <Icono nombre="mas" className="size-4 shrink-0" />
                  </summary>
                  <p>{d.r}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="cine-vidrio flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="max-w-[34rem] text-[1.08rem] text-crema">
              Elige cómo prefieres empezar. Atendemos de lunes a sábado; te respondemos para acordar día y forma.
            </p>
            <div className="flex flex-wrap gap-3">
              <BotonDiagnostico origen="portada-final" texto="Diagnóstico gratis" />
              <AccionContacto tipo="whatsapp" origen="portada-final" className="cine-boton cine-boton--suave">
                <Icono nombre="whatsapp" className="size-4" /> WhatsApp
              </AccionContacto>
              {negocio.redes.instagram && (
                <a href="https://ig.me/m/umotion.ia" target="_blank" rel="noopener noreferrer" className="cine-boton cine-boton--suave">
                  <Icono nombre="instagram" className="size-4" /> Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

/** Portada cinemática: fondo 3D fijo, índice lateral y los capítulos del guion (src/data/guion.ts). */
export function Portada() {
  return (
    <div className={`cine ${cursivaCine.variable}`}>
      <Lienzo />
      <IndiceCapitulos />
      {capitulos.map((c, i) => (
        <Capitulo key={c.id} cap={c} i={i} total={capitulos.length} primero={i === 0} accion={acciones[c.bloque]}>
          <Bloque id={c.bloque} />
        </Capitulo>
      ))}
    </div>
  );
}
