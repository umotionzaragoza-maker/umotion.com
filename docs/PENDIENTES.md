# Pendiente antes de publicar

Lo que falta no es código: son datos y decisiones que solo puede aportar Umotion. Nada de esto se ha inventado en la web.

## Imprescindible

- [ ] **Dominio** (p. ej. `umotion.es`, ahora provisional en `SITE_URL`). El correo de contacto ya está: umotionzaragoza@gmail.com.
- [ ] **Datos legales**: razón social o nombre del titular, NIF, domicilio social y, si procede, datos registrales. Completar los campos marcados en aviso legal, privacidad, cookies, condiciones y accesibilidad y revisarlos con la asesoría.
- [ ] **Confirmar la forma de trabajo** que describe la web: pasos 2–4 del método (propuesta con precio antes de empezar, puesta en marcha con pruebas, seguimiento) y los cuatro principios (`src/data/metodo.ts`).
- [ ] **Confirmar los servicios y ejemplos** (`src/data/servicios.ts`, `src/data/sectores.ts`): que todo lo que aparece lo hace Umotion; quitar lo que no.
- [ ] **Diagnóstico gratuito**: duración aproximada y si incluye algo por escrito (condiciones).
- [ ] **Alcance**: ¿se atiende en persona fuera de Zaragoza capital?
- [ ] **Logotipo en vector** (SVG). Ahora se usa el PNG recortado, que se ve bien pero no es perfecto en pantallas muy grandes.

## Recomendado

- [ ] Redes sociales (si «umotionzaragoza» se hace público, añadirlo en `negocio.redes`).
- [ ] Ficha de Google (Perfil de Empresa como negocio sin local, con zona de servicio Zaragoza).
- [ ] Primeros casos reales (con permiso del cliente): sustituirían a los ejemplos y serían la mejor prueba.
- [ ] Nombres y cara del equipo, si en algún momento se quieren mostrar.

## Para activar funciones ya preparadas

- [ ] **Hoja de solicitudes y avisos por Gmail**: pasos 2 y 5 de `docs/PUBLICAR.md`. Mientras no esté, las solicitudes llegan solo por WhatsApp y el formulario de contacto ofrece WhatsApp.
- [ ] **Analítica**: GA4 (y opcionalmente GTM) con sus IDs en Vercel (`docs/ANALITICA.md`).
- [ ] **Search Console**: verificar el dominio y enviar el sitemap.
