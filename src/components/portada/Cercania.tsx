import { Acordeon } from "@/components/ui/Acordeon";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { faq } from "@/data/faq";
import { horarioLegible, negocio } from "@/data/negocio";

const formas: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "pin", titulo: "En tu negocio", texto: `Si estás en ${negocio.zona.ciudad}, vamos a verte.` },
  { icono: "video", titulo: "Por videollamada", texto: "Compartes pantalla y nos enseñas tus herramientas." },
  { icono: "whatsapp", titulo: "Por WhatsApp o teléfono", texto: "Para dudas rápidas o para quedar." },
];

/** 04 — Cercanía (sin oficina) y las dudas de antes de empezar. */
export function Cercania() {
  return (
    <section id="donde" data-tema="claro" className="bg-papel" aria-labelledby="titulo-cercania">
      <div className="marco seccion grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="t-etiqueta text-amarillo-hondo">05 · Dónde y cuándo</p>
          <h2 id="titulo-cercania" className="t-display mt-5">
            Sin oficina. <span className="text-niebla">Vamos a tu negocio.</span>
          </h2>

          <ul className="mt-10 space-y-3">
            {formas.map((f) => (
              <li key={f.titulo} className="flex items-center gap-4 rounded-2xl border border-tinta/10 bg-crema p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tinta text-amarillo">
                  <Icono nombre={f.icono} className="size-[18px]" />
                </span>
                <span>
                  <span className="block font-semibold">{f.titulo}</span>
                  <span className="block text-[0.92rem] text-gris">{f.texto}</span>
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-8 rounded-2xl border border-tinta/10 p-5">
            <dt className="t-etiqueta text-gris">Horario de atención</dt>
            {horarioLegible.map((h) => (
              <dd key={h.dias} className="mt-3 flex justify-between gap-4 text-[0.95rem]">
                <span>{h.dias}</span>
                <span className="t-mono">{h.horas}</span>
              </dd>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="t-etiqueta text-gris">Preguntas frecuentes</h2>
          <div className="mt-5">
            <Acordeon items={faq} nivel={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
