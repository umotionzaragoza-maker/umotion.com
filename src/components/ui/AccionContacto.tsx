"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { enlaces, saludoWhatsApp } from "@/data/negocio";
import { track, type Evento } from "@/lib/analytics";

type Tipo = "llamar" | "whatsapp" | "email";

const config: Record<Tipo, { evento: Evento; externo: boolean }> = {
  llamar: { evento: "click_llamar", externo: false },
  whatsapp: { evento: "click_whatsapp", externo: true },
  email: { evento: "click_email", externo: false },
};

/** Enlace de contacto que registra la conversión (si hay consentimiento) antes de salir. */
export function AccionContacto({
  tipo,
  href,
  mensaje,
  origen,
  children,
  ...rest
}: {
  tipo: Tipo;
  href?: string;
  mensaje?: string;
  origen: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const destino =
    href ??
    {
      llamar: enlaces.llamar,
      whatsapp: enlaces.whatsapp(mensaje ?? saludoWhatsApp),
      email: enlaces.email,
    }[tipo];
  const { evento, externo } = config[tipo];

  return (
    <a
      href={destino}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => track(evento, { origen })}
      {...rest}
    >
      {children}
    </a>
  );
}
