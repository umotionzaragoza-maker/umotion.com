"use client";

import { useEffect, useState } from "react";
import { estadoAtencion, type EstadoAtencion } from "@/lib/horario";

/** Indicador en vivo según el horario de atención (hora de Zaragoza). */
export function EstadoAbierto({ variante = "corto", className = "" }: { variante?: "corto" | "largo"; className?: string }) {
  const [estado, setEstado] = useState<EstadoAtencion | null>(null);
  useEffect(() => {
    const actualizar = () => setEstado(estadoAtencion());
    actualizar();
    const id = window.setInterval(actualizar, 60_000);
    return () => window.clearInterval(id);
  }, []);
  // Reserva el espacio mientras se calcula en el cliente para evitar saltos de maquetación.
  if (!estado) return <span className={`inline-block min-w-[9rem] ${className}`} aria-hidden="true" />;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`size-2 shrink-0 rounded-full ${estado.atendiendo ? "bg-amarillo animate-pulso" : "bg-gris-claro"}`} aria-hidden="true" />
      <span>{variante === "corto" ? estado.corto : estado.largo}</span>
    </span>
  );
}
