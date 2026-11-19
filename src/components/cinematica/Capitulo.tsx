import type { ReactNode } from "react";
import type { Capitulo as TCapitulo } from "@/data/guion";

const letra = (i: number) => String.fromCharCode(65 + i);
const tres = (n: number) => String(n).padStart(3, "0");

/**
 * Un capítulo de la portada: pantalla completa con el titular a un lado (la escena 3D se aparta al otro) y,
 * debajo, su contenido. Componente de servidor: todo el texto está en el HTML para Google y sin JavaScript.
 */
export function Capitulo({
  cap,
  i,
  total,
  primero = false,
  accion,
  children,
}: {
  cap: TCapitulo;
  i: number;
  total: number;
  primero?: boolean;
  accion?: ReactNode;
  children?: ReactNode;
}) {
  const derecha = cap.lado === "derecha";
  const Titular = primero ? "h1" : "h2";

  return (
    <section id={cap.id} data-capitulo={i} data-tema="oscuro" className="cine-capitulo" aria-labelledby={`t-${cap.id}`}>
      <div className="marco cine-pantalla">
        <div className="cine-contador t-etiqueta" aria-hidden="true">
          <span>( {letra(i)} )</span>
          <span>
            {tres(i + 1)} / {tres(total)}
          </span>
        </div>

        <div className={`cine-cabeza ${derecha ? "cine-cabeza--derecha" : ""}`}>
          <div className="cine-columna-titular" data-reveal="linea">
            <p className="t-etiqueta cine-etiqueta">{cap.etiqueta}</p>
            <Titular id={`t-${cap.id}`} className="cine-titular">
              {cap.titular.map((l, k) => (
                <span key={k} className="block">
                  {l.barras && <span className="cine-barras">// </span>}
                  {l.cursiva && <em className="cine-cursiva">{l.cursiva}</em>}
                  {l.cursiva && l.texto ? " " : ""}
                  {l.texto}
                </span>
              ))}
            </Titular>
          </div>

          <div className="cine-columna-texto" data-reveal="linea">
            <p className="cine-texto">{cap.texto}</p>
            {accion}
          </div>
        </div>
      </div>

      {children && <div className="marco cine-cuerpo">{children}</div>}
    </section>
  );
}
