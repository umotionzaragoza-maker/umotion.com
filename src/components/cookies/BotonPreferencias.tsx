"use client";

import { consentimiento } from "@/lib/consent";

export function BotonPreferencias({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => consentimiento.abrirPanel()} className={className}>
      Preferencias de cookies
    </button>
  );
}
