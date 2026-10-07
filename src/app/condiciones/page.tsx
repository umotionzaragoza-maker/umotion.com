import type { Metadata } from "next";
import { Correo, PaginaLegal } from "@/components/legal/PaginaLegal";
import { negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Condiciones del diagnóstico y los servicios",
  descripcion: "Cómo funcionan el diagnóstico gratuito y la contratación de los servicios de automatización y consultoría de Umotion.",
  ruta: "/condiciones",
  indexar: false,
});

export default function Condiciones() {
  return (
    <PaginaLegal titulo="Condiciones del diagnóstico y los servicios" ruta="/condiciones">
      <h2>Diagnóstico gratuito</h2>
      <ul>
        <li>Se solicita desde la web o por WhatsApp al {negocio.telefono.visible}.</li>
        <li>Es una solicitud: queda acordado cuando {negocio.nombre} te confirma día, hora y forma.</li>
        <li>Se hace en tu negocio (en {negocio.zona.ciudad}) o por videollamada, y no tiene coste.</li>
        <li>
          La duración depende del negocio y de lo que haya que revisar; te la indicamos al acordar la cita. No te compromete a contratar nada.
        </li>
      </ul>
      <h2>Servicios</h2>
      <p>
        Los servicios (automatizaciones, webs, tiendas online, marketing digital, y consultoría y análisis de negocio) se
        presupuestan a medida. Antes de empezar te enviamos un presupuesto escrito con el alcance, lo que entregamos, lo que
        necesitamos de ti, el precio y los plazos. El trabajo empieza cuando lo aceptas por escrito.
      </p>
      <h2>Pago, cancelaciones y reclamaciones</h2>
      <p>
        Las formas y plazos de pago, las condiciones de cancelación y el soporte después de la entrega se fijan en el presupuesto de
        cada proyecto, porque dependen del tipo de trabajo. Si algo no te convence, escríbenos a <Correo />: te respondemos por
        escrito. Si eres consumidor, conservas además los derechos que te reconoce la normativa de consumo, incluido acudir a las
        oficinas de consumo de tu comunidad autónoma.
      </p>
    </PaginaLegal>
  );
}
