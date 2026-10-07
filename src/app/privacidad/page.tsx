import type { Metadata } from "next";
import { Correo, Dato, PaginaLegal } from "@/components/legal/PaginaLegal";
import { titular } from "@/data/legal";
import { negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({
  titulo: "Política de privacidad",
  descripcion: "Cómo trata Umotion los datos personales de quienes solicitan un diagnóstico gratuito o escriben desde su web.",
  ruta: "/privacidad",
  indexar: false,
});

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" ruta="/privacidad">
      <h2>Responsable</h2>
      <p>
        <Dato valor={titular.nombre} falta="Razón social o nombre del titular" />, NIF <Dato valor={titular.nif} falta="NIF" />,{" "}
        <Dato valor={titular.domicilio} falta="domicilio" />, {negocio.zona.ciudad}. Contacto: <Correo /> · {negocio.telefono.visible}.
      </p>

      <h2>Qué datos tratamos y cómo</h2>
      <p>
        <strong>Solicitud de diagnóstico.</strong> Cuando pulsas «Enviar por WhatsApp», anotamos tu solicitud (nombre, negocio y
        tipo, tareas que marcas, detalle, preferencia de lugar y momento y, si lo indicas, tu teléfono) en nuestro registro de
        solicitudes para atenderla y hacer su seguimiento, y se abre WhatsApp con la solicitud escrita: eres tú quien decide
        enviarla. A partir de ese momento el mensaje se rige también por las condiciones de WhatsApp.
      </p>
      <p>
        <strong>Formulario de contacto.</strong> Si nos escribes, recibimos tu nombre, email o teléfono, el motivo y el mensaje. Los
        usamos únicamente para responderte y los anotamos en nuestro registro de mensajes para no dejar ninguno sin atender.
      </p>
      <p>
        <strong>Datos de tu negocio durante un proyecto.</strong> Si después trabajamos juntos, solo accederemos a los datos
        necesarios para cada trabajo y con tu autorización. Cuando un proyecto implique tratar datos personales de tus clientes o
        empleados, firmaremos contigo un contrato de encargo del tratamiento (artículo 28 del RGPD) que fija qué podemos hacer con
        ellos.
      </p>
      <p>
        <strong>Medición de visitas.</strong> Contamos las visitas de forma agregada con Vercel Web Analytics, que no usa cookies ni
        guarda nada en tu dispositivo. Solo si aceptas la analítica en el aviso de cookies usamos además Google Analytics para medir
        con más detalle cómo se usa la web.
      </p>

      <h2>Base legal y conservación</h2>
      <table>
        <thead>
          <tr>
            <th>Tratamiento</th>
            <th>Base legal</th>
            <th>Cuánto tiempo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Solicitud de diagnóstico</td>
            <td>Aplicar, a petición tuya, medidas precontractuales (art. 6.1.b RGPD)</td>
            <td>Hasta 12 meses desde el último contacto si no llegamos a trabajar juntos</td>
          </tr>
          <tr>
            <td>Formulario de contacto</td>
            <td>Tu consentimiento al enviarlo (art. 6.1.a RGPD)</td>
            <td>Hasta 12 meses desde el último contacto</td>
          </tr>
          <tr>
            <td>Clientes</td>
            <td>Ejecución del contrato (art. 6.1.b) y obligaciones legales (art. 6.1.c)</td>
            <td>Mientras dure la relación y, después, los plazos que exige la ley (por ejemplo, 6 años la documentación contable)</td>
          </tr>
          <tr>
            <td>Medición sin cookies (Vercel)</td>
            <td>Interés legítimo en saber cómo se usa la web, con datos agregados (art. 6.1.f)</td>
            <td>No identifica a nadie</td>
          </tr>
          <tr>
            <td>Google Analytics, si lo aceptas</td>
            <td>Tu consentimiento (art. 6.1.a), que puedes retirar en «Preferencias de cookies»</td>
            <td>Hasta 14 meses en Google Analytics</td>
          </tr>
        </tbody>
      </table>
      <p>No tomamos decisiones automatizadas sobre ti ni usamos tus datos para crear perfiles.</p>

      <h2>Destinatarios y encargados</h2>
      <p>
        No cedemos tus datos a nadie salvo obligación legal. Para que la web funcione usamos estos proveedores, que tratan los datos
        por cuenta nuestra:
      </p>
      <ul>
        <li>Vercel Inc. (alojamiento de la web y medición de visitas sin cookies).</li>
        <li>Google (hoja de solicitudes y mensajes, correo de avisos y, si lo aceptas, Google Analytics).</li>
        <li>WhatsApp (Meta), solo cuando tú decides enviarnos el mensaje desde tu móvil.</li>
      </ul>
      <p>
        Algunos de estos proveedores pueden tratar datos fuera de la Unión Europea. Lo hacen con las garantías que exige el RGPD: el
        Marco de Privacidad de Datos UE-EE. UU. o las cláusulas contractuales tipo de la Comisión Europea.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a{" "}
        <Correo />. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </PaginaLegal>
  );
}
