import type { Metadata } from "next";
import { BotonPreferencias } from "@/components/cookies/BotonPreferencias";
import { PaginaLegal } from "@/components/legal/PaginaLegal";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({ titulo: "Política de cookies", descripcion: "Qué cookies y qué almacenamiento del navegador usa la web de Umotion, y cómo cambiar tu elección cuando quieras.", ruta: "/cookies", indexar: false });

export default function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies" ruta="/cookies">
      <p>
        Esta web usa el mínimo imprescindible. Nada que no sea técnico se activa sin tu permiso, y puedes cambiar tu decisión cuando
        quieras: <BotonPreferencias className="font-semibold text-texto underline underline-offset-2" />.
      </p>

      <h2>Técnicas (siempre activas)</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Para qué</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>um-consentimiento-v1</td>
            <td>Almacenamiento local</td>
            <td>Recordar tu elección sobre cookies</td>
            <td>Hasta que la cambies</td>
          </tr>
        </tbody>
      </table>

      <h2>Medición de visitas sin cookies</h2>
      <p>
        Contamos las visitas con Vercel Web Analytics. No usa cookies ni guarda nada en tu navegador, y solo nos da cifras
        agregadas: páginas vistas, país, tipo de dispositivo y desde qué web llegas. También cuenta, sin datos tuyos, cuántas
        solicitudes de diagnóstico se envían y cuántos clics reciben los botones de contacto. Como no usa cookies ni accede a tu
        dispositivo, no necesita tu consentimiento; se basa en nuestro interés legítimo en saber qué páginas sirven y cuáles no.
      </p>

      <h2>Analítica y publicidad (solo con tu consentimiento)</h2>
      <p>
        Si se configuran y las aceptas, se cargarán Google Analytics 4 / Google Tag Manager (analítica) y Meta Pixel (medición de
        campañas). Hoy {process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GTM_ID ? "está activa la analítica de Google" : "no hay ninguna activa"}. Si
        se activan, estas son las cookies que instalan:
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>De quién</th>
            <th>Para qué</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Google Analytics</td>
            <td>Distinguir visitantes de forma anónima</td>
            <td>2 años</td>
          </tr>
          <tr>
            <td>_ga_&lt;ID&gt;</td>
            <td>Google Analytics</td>
            <td>Mantener el estado de la visita</td>
            <td>2 años</td>
          </tr>
          <tr>
            <td>_fbp</td>
            <td>Meta Pixel</td>
            <td>Medir el resultado de campañas en Facebook e Instagram</td>
            <td>3 meses</td>
          </tr>
        </tbody>
      </table>
      <p>Puedes aceptarlas, rechazarlas o cambiar de opinión cuando quieras en «Preferencias de cookies», al pie de cada página.
      </p>
    </PaginaLegal>
  );
}
