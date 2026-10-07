// zod/mini: misma validación que zod con una fracción del peso en el navegador.
import * as z from "zod/mini";

/** Esquema compartido por el formulario (cliente) y la API (servidor). */
const limpiar = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
const texto = (min: number, max: number) => z.string().check(z.overwrite(limpiar), z.minLength(min), z.maxLength(max));
const opcional = (max: number, valido: z.ZodMiniType<string, string>) =>
  z.pipe(z.string().check(z.trim(), z.maxLength(max)), z.union([z.literal(""), valido]));

export const MOTIVOS = ["Quiero automatizar algo concreto", "Consulta sobre IA para mi negocio", "Colaboraciones", "Otro"] as const;

export const esquemaContacto = z
  .object({
    nombre: texto(2, 80),
    email: opcional(120, z.email()),
    telefono: opcional(20, z.string().check(z.regex(/^[+\d][\d\s-]{7,18}$/))),
    motivo: z.enum(MOTIVOS),
    mensaje: texto(10, 2000),
    privacidad: z.literal(true),
    // Antispam: campo trampa invisible (se descarta en el servidor) y tiempo mínimo de rellenado.
    web: z._default(z.optional(z.string().check(z.maxLength(200))), ""),
    t: z.int().check(z.positive()),
  })
  // `when`: se comprueba aunque otros campos fallen, para mostrar todos los errores de una vez.
  .check(
    z.refine((d) => !!d.email || !!d.telefono, {
      error: "Indica un email o un teléfono",
      path: ["email"],
      when: (p) => typeof p.value === "object" && p.value !== null,
    }),
  );

export type DatosContacto = z.infer<typeof esquemaContacto>;

export const escaparHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
