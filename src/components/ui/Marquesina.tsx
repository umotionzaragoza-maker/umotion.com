/** Banda de texto infinita. La segunda copia es decorativa y se oculta a lectores de pantalla. */
export function Marquesina({ elementos, className = "" }: { elementos: string[]; className?: string }) {
  const fila = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {elementos.map((e, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 md:px-10">{e}</span>
          <span className="size-1.5 rotate-45 bg-current opacity-60" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-deslizar motion-reduce:animate-none">
        {fila(false)}
        {fila(true)}
      </div>
    </div>
  );
}
