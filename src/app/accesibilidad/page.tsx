import type { Metadata } from "next";
import { Correo, PaginaLegal } from "@/components/legal/PaginaLegal";
import { negocio } from "@/data/negocio";
import { metadatos } from "@/lib/seo";

export const metadata: Metadata = metadatos({ titulo: "Accesibilidad", descripcion: "Declaración de accesibilidad de la web de Umotion: qué hemos hecho para que cualquier persona pueda usarla y cómo avisarnos.", ruta: "/accesibilidad", indexar: false });

export default function Accesibilidad() {
  return (
    <PaginaLegal titulo="Accesibilidad" ruta="/accesibilidad">
      <p>
        Queremos que cualquier persona pueda conocer nuestros servicios y pedir un diagnóstico. Esta web se ha diseñado con el objetivo
        de cumplir las pautas WCAG 2.2 en su nivel AA.
      </p>
      <h2>Qué hemos hecho</h2>
      <ul>
        <li>Navegación completa con teclado, con el foco siempre visible y un enlace para saltar al contenido.</li>
        <li>Estructura de encabezados, landmarks y etiquetas pensada para lectores de pantalla.</li>
        <li>Contraste de color suficiente en textos y controles.</li>
        <li>Botones y zonas táctiles de al menos 44 píxeles.</li>
        <li>Si tu dispositivo pide reducir el movimiento, se desactivan animaciones y desplazamiento suave.</li>
        <li>Formularios con etiquetas visibles y mensajes de error asociados a cada campo.</li>
      </ul>
      <h2>Evaluación</h2>
      <p>
        Autoevaluación realizada por el equipo en octubre de 2026 con revisión automática (títulos y encabezados, textos
        alternativos, nombres de botones y enlaces, etiquetas de formularios, contraste y tamaño de las zonas táctiles) a 1440 y 390
        píxeles. No se ha hecho todavía una auditoría externa; la haremos antes de declarar la conformidad con las pautas WCAG 2.1 AA.
      </p>
      <h2>¿Encuentras una barrera?</h2>
      <p>
        Cuéntanoslo en <Correo /> o por WhatsApp al {negocio.telefono.visible} y te atendemos por esa vía mientras lo
        solucionamos.
      </p>
    </PaginaLegal>
  );
}
