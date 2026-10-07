"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

declare global {
  interface Window {
    __movimientoListo?: boolean;
  }
}

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/**
 * Capa de movimiento de toda la web.
 * - Lenis: desplazamiento suave con rueda (el táctil sigue siendo nativo).
 * - GSAP + ScrollTrigger: animaciones declarativas por atributos, para que las páginas
 *   sean componentes de servidor y el movimiento sea solo una mejora progresiva:
 *     data-reveal            aparece subiendo
 *     data-reveal="linea"    sus hijos aparecen en cascada
 *     data-titular           el texto entra palabra a palabra
 *     data-mascara           la imagen se descubre con una cortina y se asienta de escala
 *     data-parallax="0.12"   desplazamiento parallax (fracción de su altura)
 * Con "reducir movimiento" no se inicia nada y todo se muestra al instante.
 */
export function Movimiento({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducir = useRef(false);

  useEffect(() => {
    reducir.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.__movimientoListo = true;
    if (reducir.current) {
      document.documentElement.classList.remove("movimiento");
      return;
    }

    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  // Al cambiar de página: arriba del todo, sin animación.
  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    if (!lenis) window.scrollTo(0, 0);
  }, [pathname, lenis]);

  useGSAP(
    (_ctx, contextSafe) => {
      if (reducir.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let vivo = true;

      const revelar = (el: HTMLElement) =>
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );

      const revelarLinea = (el: HTMLElement) => {
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(
          el.children,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      };

      // El texto se parte al llegar a él (no todos los titulares al cargar) y con las
      // fuentes ya cargadas; autoSplit lo rehace si cambia el ancho (giro del móvil).
      const titular = (el: HTMLElement) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: contextSafe!(() => {
            if (!vivo) return;
            SplitText.create(el, {
              type: "words,lines",
              mask: "lines",
              linesClass: "st-linea",
              autoSplit: true,
              onSplit: (self) => {
                gsap.set(el, { autoAlpha: 1 });
                return gsap.from(self.words, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.035, delay: Number(el.dataset.delay ?? 0) });
              },
            });
          }),
        });

      const mascara = (el: HTMLElement) => {
        const img = el.querySelector("img, video");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      };

      const parallax = (el: HTMLElement) => {
        const f = Number(el.dataset.parallax) || 0.12;
        gsap.fromTo(
          el,
          { yPercent: -f * 50 },
          {
            yPercent: f * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      };

      const animar = contextSafe!((el: HTMLElement) => {
        if (!vivo) return;
        const d = el.dataset;
        if (d.reveal !== undefined) (d.reveal === "linea" ? revelarLinea : revelar)(el);
        if (d.titular !== undefined) titular(el);
        if (d.mascara !== undefined) mascara(el);
        if (d.parallax !== undefined) parallax(el);
      });

      // Lo que se ve al cargar se anima ya; el resto se prepara en tandas cortas cuando el
      // navegador está libre, para no alargar la hidratación ni bloquear el primer toque.
      const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal],[data-titular],[data-mascara],[data-parallax]"));
      const limite = window.innerHeight * 1.1;
      const pendientes: HTMLElement[] = [];
      for (const el of elementos) {
        if (el.getBoundingClientRect().top < limite) animar(el);
        else pendientes.push(el);
      }

      const w = window as Window & {
        requestIdleCallback?: (cb: (p: { didTimeout: boolean; timeRemaining: () => number }) => void, o?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      let tarea = 0;
      const programar = (fn: (p?: { didTimeout: boolean; timeRemaining: () => number }) => void) =>
        w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 600 }) : window.setTimeout(fn, 50);
      const tanda = (plazo?: { didTimeout: boolean; timeRemaining: () => number }) => {
        const fin = performance.now() + (plazo && !plazo.didTimeout ? Math.min(plazo.timeRemaining(), 12) : 8);
        do animar(pendientes.shift()!);
        while (pendientes.length && performance.now() < fin);
        if (pendientes.length && vivo) tarea = programar(tanda);
      };
      if (pendientes.length) tarea = programar(tanda);

      // Las posiciones se calculan con la fuente de reserva si la buena aún no ha llegado:
      // recalcular una vez al terminar de cargar las fuentes y, agrupado, al cargar imágenes.
      let espera = 0;
      const recalcular = () => {
        window.clearTimeout(espera);
        espera = window.setTimeout(() => vivo && ScrollTrigger.refresh(), 300);
      };
      if (document.fonts.status !== "loaded") void document.fonts.ready.then(recalcular);
      const imgs = Array.from(document.images).filter((i) => !i.complete);
      imgs.forEach((i) => i.addEventListener("load", recalcular, { once: true }));

      return () => {
        vivo = false;
        if (w.cancelIdleCallback) w.cancelIdleCallback(tarea);
        else window.clearTimeout(tarea);
        window.clearTimeout(espera);
        imgs.forEach((i) => i.removeEventListener("load", recalcular));
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
