"use client";

import { useSyncExternalStore } from "react";

/**
 * Consentimiento de cookies (RGPD / LSSI, guía AEPD 2023):
 * - Nada que no sea técnico se carga antes de aceptar.
 * - "Rechazar" tiene el mismo peso visual que "Aceptar".
 * - La elección se puede cambiar en cualquier momento desde el pie de página.
 */
export type Consentimiento = { analitica: boolean; marketing: boolean; fecha: string; version: 1 };

const CLAVE = "um-consentimiento-v1";
const oyentes = new Set<() => void>();
let actual: Consentimiento | null | undefined; // undefined = aún no leído
let panelAbierto = false;

function leer(): Consentimiento | null {
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Consentimiento>;
    if (c.version !== 1) return null;
    return { analitica: c.analitica === true, marketing: c.marketing === true, fecha: String(c.fecha ?? ""), version: 1 };
  } catch {
    return null;
  }
}

const emitir = () => oyentes.forEach((f) => f());

export const consentimiento = {
  obtener(): Consentimiento | null {
    if (typeof window === "undefined") return null;
    if (actual === undefined) actual = leer();
    return actual;
  },
  guardar(analitica: boolean, marketing: boolean) {
    actual = { analitica, marketing, fecha: new Date().toISOString(), version: 1 };
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(actual));
    } catch {
      /* sin almacenamiento: se respeta durante la sesión */
    }
    panelAbierto = false;
    emitir();
    window.dispatchEvent(new CustomEvent("um:consentimiento", { detail: actual }));
  },
  abrirPanel() {
    panelAbierto = true;
    emitir();
  },
  cerrarPanel() {
    panelAbierto = false;
    emitir();
  },
};

type Snapshot = { valor: Consentimiento | null; decidido: boolean; panel: boolean };
let snap: Snapshot = { valor: null, decidido: true, panel: false };

function snapshot(): Snapshot {
  const valor = consentimiento.obtener();
  const decidido = valor !== null;
  if (snap.valor !== valor || snap.decidido !== decidido || snap.panel !== panelAbierto) {
    snap = { valor, decidido, panel: panelAbierto };
  }
  return snap;
}

// En el servidor damos por decidido para no pintar el banner en el HTML estático.
const servidor: Snapshot = { valor: null, decidido: true, panel: false };

export function useConsentimiento() {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    snapshot,
    () => servidor,
  );
}
