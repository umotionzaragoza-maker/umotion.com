/** Sello circular de marca con texto en círculo. Gira muy despacio; estático con "reducir movimiento". */
export function Sello({
  texto = "Umotion · Automatización e IA · Zaragoza · ",
  centro = "U",
  className = "size-32",
  tono = "claro",
  id = "sello",
}: {
  texto?: string;
  centro?: string;
  className?: string;
  tono?: "claro" | "oscuro" | "amarillo";
  /** Único por página si hay varios sellos (lo usa el trazado circular del texto). */
  id?: string;
}) {
  const colores = {
    claro: "text-crema",
    oscuro: "text-tinta",
    amarillo: "text-amarillo",
  }[tono];
  return (
    <div className={`relative ${colores} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-girar motion-reduce:animate-none">
        <defs>
          <path id={`circulo-${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="currentColor" fontSize="15.5" letterSpacing="3.2" fontWeight="600" style={{ textTransform: "uppercase" }}>
          <textPath href={`#circulo-${id}`}>{texto}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-[1.8rem] font-semibold leading-none">{centro}</span>
      </div>
    </div>
  );
}
