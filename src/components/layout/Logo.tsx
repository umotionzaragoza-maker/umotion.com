import Image from "next/image";
import logoClaro from "@/assets/marca/logo-claro.png";
import logoOscuro from "@/assets/marca/logo-oscuro.png";

/**
 * Logotipo oficial de Umotion (recortado del PNG del cliente con scripts/imagenes/logo.mjs).
 * `sobre`: el fondo que tiene debajo. Sobre oscuro, letras blancas; sobre claro, letras en tinta.
 * Pendiente: versión vectorial (SVG) del cliente para máxima nitidez (docs/PENDIENTES.md).
 */
export function Logo({ sobre = "oscuro", className = "h-7 md:h-8", prioridad = false }: { sobre?: "oscuro" | "claro"; className?: string; prioridad?: boolean }) {
  return (
    <Image
      src={sobre === "oscuro" ? logoClaro : logoOscuro}
      alt="Umotion"
      className={`w-auto ${className}`}
      sizes="160px"
      priority={prioridad}
    />
  );
}
