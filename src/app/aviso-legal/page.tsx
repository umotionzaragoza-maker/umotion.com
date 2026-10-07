import type { Metadata } from "next";
import { Correo, Dato, PaginaLegal } from "@/components/legal/PaginaLegal";
import { titular } from "@/data/legal";
import { negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Aviso legal",
  descripcion: "Aviso legal de la web de Umotion: titular, condiciones de uso y responsabilidad.",
  ruta: "/aviso-legal",
  indexar: false,
});

export default function AvisoLegal() {
  return (
    <PaginaLegal titulo="Aviso legal" ruta="/aviso-legal">
      <h2>Titular de la web</h2>
      <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI-CE):</p>
      <ul>
        <li>
          Titular: <Dato valor={titular.nombre} falta="Razón social o nombre del titular" />
        </li>
        <li>
          NIF/CIF: <Dato valor={titular.nif} falta="NIF" />
        </li>
        <li>
          Domicilio: <Dato valor={titular.domicilio} falta="domicilio" />, {negocio.zona.ciudad}
        </li>
        <li>
          Email: <Correo /> · Teléfono: {negocio.telefono.visible}
        </li>
        {titular.esSociedad && (
          <li>
            Datos registrales: <Dato valor={titular.registro} falta="Registro Mercantil" />
          </li>
        )}
      </ul>
      <h2>Objeto</h2>
      <p>
        Esta web informa sobre los servicios de {negocio.nombreLegible} (automatización de procesos, creación de webs y tiendas online,
        marketing digital, y consultoría y análisis de negocio) y permite solicitar un diagnóstico gratuito. Las solicitudes se envían por WhatsApp y {negocio.nombre} responde
        para acordarlo; la web no realiza cobros ni contrataciones.
      </p>
      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el logotipo, las ilustraciones y el diseño de la web pertenecen a su titular. El origen de cada imagen se detalla
        en la página de <a href="/creditos">créditos de imagen</a>.
      </p>
      <h2>Responsabilidad</h2>
      <p>
        Cuidamos que la información de esta web sea correcta y esté al día, pero es orientativa: lo que vale para cada proyecto es el
        presupuesto escrito que acordemos contigo. Los ejemplos de automatizaciones son ejemplos de lo que se puede hacer, no casos de
        clientes ni resultados garantizados.
      </p>
      <p>
        No respondemos de interrupciones o errores técnicos ajenos a nuestro control, ni del contenido de las webs externas a las que
        enlazamos (por ejemplo, WhatsApp). Quien use la web se compromete a hacerlo de buena fe y a no introducir datos falsos o de
        terceros sin su permiso.
      </p>
      <h2>Legislación aplicable</h2>
      <p>
        Esta web se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales
        de {negocio.zona.ciudad}, salvo que la ley reconozca a quien sea consumidor el derecho a acudir a los de su domicilio.
      </p>
    </PaginaLegal>
  );
}
