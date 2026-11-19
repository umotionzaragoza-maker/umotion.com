import localFont from "next/font/local";

/** Cursiva de los titulares cinemáticos (Fraunces itálica, autoalojada). */
export const cursivaCine = localFont({
  src: "../../assets/fuentes/fraunces-italica.ttf",
  style: "italic",
  weight: "400",
  variable: "--font-cine-cursiva",
  display: "swap",
});
