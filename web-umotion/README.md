# Umotion · Web oficial

Web de **Umotion**, automatización de procesos e inteligencia artificial para negocios de Zaragoza.
Una web editorial y comercial pensada para una sola cosa: que el visitante pida su **diagnóstico gratuito**.

| | |
|---|---|
| Estrategia y decisiones | [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md) |
| Investigación y fuentes | [`docs/INVESTIGACION.md`](docs/INVESTIGACION.md) |
| Imagen (ilustraciones de marca y futura sesión de fotos) | [`docs/FOTOGRAFIA.md`](docs/FOTOGRAFIA.md) |
| Seguridad y despliegue | [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md) |
| Analítica y conversión | [`docs/ANALITICA.md`](docs/ANALITICA.md) |
| **Pendiente antes de publicar** | [`docs/PENDIENTES.md`](docs/PENDIENTES.md) |
| **Hoja de solicitudes y avisos por Gmail** | [`integraciones/hoja-de-solicitudes/`](integraciones/hoja-de-solicitudes/LEEME.md) |
| **Puesta en marcha paso a paso** | [`docs/PUBLICAR.md`](docs/PUBLICAR.md) |
| **Rediseño v2 (qué cambió y por qué)** | [`docs/V2.md`](docs/V2.md) |

## Tecnología

Next.js 16 (App Router) + React 19 + TypeScript estricto · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis ·
Instrument Sans + Geist Mono (autoalojada) ·
`@vercel/analytics` · `zod/mini` · sharp. Sin librerías de componentes ni iconos externos.

## Arrancar

**Para verla sin más**: doble clic en `Abrir la web.cmd` (compila si hace falta y abre http://localhost:5201).

```bash
npm run dev            # http://localhost:5200
npm run build          # compila y genera todas las páginas
npm run start          # producción en http://localhost:5201
npm run typecheck
npm test               # 36 pruebas
npm run check:rutas    # con `npm run start` en marcha
npm run auditar        # SEO y accesibilidad a 1440 y 390 px
npm run medir          # rendimiento en condiciones de Lighthouse (móvil; `-- escritorio` para escritorio)
```

Sin variables de entorno la web funciona completa (las solicitudes van por WhatsApp). `.env.example` explica cada una.

## Dónde se cambia cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Teléfono, WhatsApp, correo, redes, horario de atención, zona | `src/data/negocio.ts` |
| Servicios (y si tienen precio o «a consultar») | `src/data/servicios.ts` |
| Ejemplos «cuando → entonces» por tipo de negocio | `src/data/sectores.ts` |
| Pasos del método y principios | `src/data/metodo.ts` |
| Preguntas frecuentes | `src/data/faq.ts` |
| Opciones del formulario de diagnóstico y mensaje de WhatsApp | `src/lib/diagnostico.ts` |
| Hoja de solicitudes y avisos (script de Google) | `integraciones/hoja-de-solicitudes/Codigo.gs` |
| Ilustraciones y logotipo | `scripts/imagenes/` → `src/assets/` + `src/lib/fotos.ts` + `src/data/creditos.ts` |
| Colores, tipografía, botones | `src/app/globals.css` |

Todo lo que se muestra sale de esos datos: cambiar el horario en `negocio.ts` actualiza a la vez la cabecera
(«Atendemos · hasta 20:00»), el pie, la página de contacto, el diagnóstico y los datos estructurados para Google.

## Estructura

```
src/
  app/            Páginas + api/diagnostico + api/contacto + sitemap, robots, iconos, OG
  components/
    portada/      Portada v2 (Heroe + PanelActividad, Configurador, Pasos, Oferta, Cercania)
    diagnostico/  Formulario de solicitud del diagnóstico
    layout/ motion/ cookies/ contacto/ legal/ seo/ ui/  (ui/Regla.tsx = la seña «cuando → entonces»)
  data/           Fuente única de verdad del negocio
  lib/            Diagnóstico, horario, analítica, consentimiento, SEO, imágenes OG
docs/             Documentación de entrega (y docs/marca con el logotipo original)
integraciones/    Hoja de solicitudes (Google Apps Script)
scripts/          Rutas, auditoría, medición, ilustraciones y logotipo
```

## Estado de la verificación (30/09/2026)

- `next build`: 23 rutas generadas sin errores ni avisos. TypeScript estricto sin errores. `npm audit`: 0 vulnerabilidades.
- `npm test`: 36 pruebas (solicitud de diagnóstico y mensaje de WhatsApp, hoja de solicitudes en Apps Script con imitación de
  Sheets y Gmail, endpoint de diagnóstico contra CSRF/bots/validación, horario de atención en verano, invierno y desde otra zona
  horaria, formulario de contacto, medición con y sin consentimiento, integridad de datos y datos estructurados).
- `check:rutas`: 25 comprobaciones (páginas, iconos, OG, sitemap, robots, manifest, 404 y alias), 0 fallos.
- `auditar`: 14 URL a 1440 y 390 px, **0 incidencias** (títulos ≤ 65, descripciones ≤ 160, un h1, jerarquía, alt, nombres de
  controles, etiquetas, contraste, objetivos táctiles ≥ 24 px).
- Flujo de conversión probado en el navegador: validación (nombre y consentimiento), solicitud con número `D-AAMMDD-XXXX`,
  WhatsApp al 633 27 59 09 con el mensaje completo y pantalla de confirmación.
- Revisión visual a 1440 y 390 px de la portada y del diagnóstico; consola sin errores.
- Seguridad revisada con peticiones reales: 405/403/415/413/422/429 donde corresponde, cabeceras CSP/HSTS/nosniff/DENY.
- Rendimiento (`npm run medir`, CPU 4× más lenta y red móvil; varias pasadas, máquina con carga variable):

  | | LCP | CLS | Bloqueo (TBT) |
  |---|---|---|---|
  | Móvil | 1,7–2,9 s | 0 | 120–560 ms (varía con la carga del equipo; una web de referencia del mismo motor dio 300–340 ms en la misma sesión) |
  | Escritorio | 0,4–0,6 s | ≤ 0,002 | 0 ms |
