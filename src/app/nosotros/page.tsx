import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import simbolo from "@/assets/marca/simbolo.png";
import { CabeceraPagina } from "@/components/layout/CabeceraPagina";
import { Icono } from "@/components/ui/Icono";
import { Sello } from "@/components/ui/Sello";
import { pilares } from "@/data/metodo";
import { negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Nosotros: el equipo de Umotion en Zaragoza",
  descripcion:
    "Umotion es un equipo de Zaragoza especializado en webs, tiendas online, marketing digital y automatización con IA para comercios, hostelería, profesionales y pymes.",
  ruta: "/nosotros",
  tipo: "article",
});

export default function Nosotros() {
  return (
    <>
      <CabeceraPagina
        eyebrow="Nosotros"
        titulo={
          <>
            Tecnología de aquí, <span className="italica text-amarillo">para negocios de aquí.</span>
          </>
        }
        entradilla={`${negocio.nombre} es un equipo de ${negocio.zona.ciudad} especializado en webs, tiendas online, marketing digital y automatización con inteligencia artificial. Trabajamos con negocios pequeños para que consigan más clientes y pierdan menos tiempo en tareas repetitivas.`}
        migas={[{ nombre: "Nosotros", ruta: "/nosotros" }]}
        foto="marca"
      />

      {/* Por qué */}
      <section data-tema="claro" className="bg-papel" aria-labelledby="titulo-por-que">
        <div className="marco seccion grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-eyebrow text-gris">Por qué existimos</p>
            <h2 id="titulo-por-que" className="t-display mt-5" data-titular>
              La tecnología ya está. <span className="italica text-amarillo-hondo">Falta alguien que se siente contigo.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg text-gris lg:col-span-6 lg:col-start-7" data-reveal>
            <p>
              Tener una buena web, vender por internet, hacer marketing o automatizar tareas ya no es cosa de grandes empresas: las
              herramientas existen y muchas las tienes a mano. Lo difícil es saber cuáles, para qué y cómo encajarlas en un negocio
              que no puede parar.
            </p>
            <p>
              Por eso trabajamos al revés que un catálogo de software: primero vamos a tu negocio (o nos conectamos por
              videollamada), vemos cómo trabajas un día normal y, solo después, proponemos lo que tiene sentido para ti.
            </p>
            <p className="font-semibold text-texto">
              Nuestro objetivo es sencillo: que te lleguen más clientes y que dediques tu tiempo a tu oficio, no a copiar datos de un sitio a otro.
            </p>
          </div>
        </div>
      </section>

      {/* El nombre */}
      <section data-tema="oscuro" className="oscuro relative overflow-hidden" aria-labelledby="titulo-nombre">
        <div className="marco seccion grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-sm" data-reveal>
              <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(53_200_255/0.22),transparent_65%)]" aria-hidden="true" />
              <Image src={simbolo} alt="Símbolo de Umotion: una U que termina en una flecha hacia arriba" className="relative mx-auto h-auto w-3/4 translate-y-[12%]" sizes="(min-width: 1024px) 24vw, 60vw" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-eyebrow text-amarillo">El nombre</p>
            <h2 id="titulo-nombre" className="t-display mt-5" data-titular>
              Una U que da la vuelta <span className="italica text-amarillo">y sube.</span>
            </h2>
            <p className="t-lead mt-6 text-crema/75" data-reveal>
              Así es nuestro símbolo, y así entendemos el trabajo: coger una tarea que hoy pesa, darle la vuelta y convertirla en
              algo que mueve el negocio. <em>Motion</em>, movimiento: que las cosas pasen solas.
            </p>
            <Sello id="nosotros" className="mt-12 hidden size-32 sm:block" />
          </div>
        </div>
      </section>

      {/* Principios */}
      <section data-tema="claro" className="bg-hueso" aria-labelledby="titulo-principios">
        <div className="marco seccion">
          <div className="max-w-3xl">
            <p className="t-eyebrow text-gris">Lo que nos importa</p>
            <h2 id="titulo-principios" className="t-h1 mt-5" data-titular>
              Cuatro ideas <span className="italica text-amarillo-hondo">que no cambian.</span>
            </h2>
          </div>
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4" data-reveal="linea">
            {pilares.map((p, i) => (
              <li key={p.titulo} className="border-t border-tinta/15 pt-6">
                <span className="t-num italica block text-[3rem] leading-none text-amarillo-hondo" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="t-h3 mt-5">{p.titulo}</h3>
                <p className="mt-3 text-gris">{p.texto}</p>
              </li>
            ))}
          </ul>
          <div className="mt-16 flex flex-wrap gap-3" data-reveal>
            <Link href="/diagnostico" className="btn">
              Pedir diagnóstico gratis <Icono nombre="flecha" className="flecha size-4" />
            </Link>
            <Link href="/metodo" className="btn btn-contorno">
              Cómo trabajamos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
