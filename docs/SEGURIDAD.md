# Seguridad, privacidad y despliegue

Revisión del 30/09/2026 con el servidor de producción (`npm run start`) y peticiones reales.

## Superficie de ataque

La web es casi toda estática (todas las páginas prerenderizadas). Las partes con servidor son `POST /api/diagnostico` y
`POST /api/contacto`. No hay cuentas, contraseñas, pagos ni base de datos propia: la solicitud de diagnóstico viaja en el
mensaje de WhatsApp que la persona envía y, si la hoja de Umotion está conectada, se anota en ella (Google Sheets de Umotion,
ver `integraciones/hoja-de-solicitudes/`).

## Endpoint `/api/diagnostico`

- Primero las defensas comunes (`src/lib/servidor.ts`): origen propio (CSRF), solo JSON, cuerpo ≤ 10 KB y como máximo 6 envíos
  cada 10 minutos por IP. Se aplican aunque la hoja no esté conectada.
- Validación estricta con `zod/mini` (`src/lib/diagnostico.ts`): tipo de negocio, tareas, lugar y momento solo de listas cerradas;
  textos acotados y limpios de caracteres de control; número de solicitud con formato cerrado (`D-AAMMDD-XXXX`).
- Bots: campo trampa o envío en menos de 3 s → respuesta «ok» sin hacer nada.
- Se reenvía a la aplicación web de Apps Script con una clave secreta (`HOJA_WEBHOOK_SECRETO`) que nunca llega al navegador.
  Solo viajan los datos útiles (sin los campos técnicos). Sin hoja responde 503 y el WhatsApp funciona igual.
- En la hoja, los textos que empiezan por `= + - @` se guardan como texto (sin inyección de fórmulas), los números repetidos se
  ignoran y el correo de aviso escapa el HTML. Probado en `tests/hoja.test.ts`.

## Endpoint `/api/contacto`

| Ataque / caso | Respuesta (probado) |
|---|---|
| Método distinto de POST | 405 |
| Sin `Origin` o de otro dominio (CSRF) | 403 |
| Tipo de contenido no JSON | 415 |
| Cuerpo > 10 KB | 413 |
| Datos inválidos o sin consentimiento | 422 |
| Bot (campo trampa relleno o envío en < 3 s) | 200 falso, no se envía nada |
| Más de 5 envíos en 10 minutos por IP | 429 |
| HTML/script en los campos | Se valida como texto y se **escapa** al componer el correo |

Límite de peticiones en memoria: vale para una instancia. Con mucho tráfico (varias instancias en Vercel), sustituir el `Map`
por Upstash Redis o Vercel KV con la misma lógica. La IP se toma de `x-forwarded-for`, que pone Vercel.

## Cabeceras (en `next.config.ts`, verificadas en producción)

| Cabecera | Valor / motivo |
|---|---|
| `Content-Security-Policy` | Solo recursos propios. Terceros permitidos únicamente para GTM/GA4/Meta, que solo se cargan tras consentimiento. Sin iframes salvo GTM, sin vídeo ni audio (`media-src 'none'`), `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (además de `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Cámara, micrófono, geolocalización, pagos, USB y temas de navegación desactivados |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Powered-By` | Eliminada (`poweredByHeader: false`) |

### Sobre `'unsafe-inline'` en scripts

Las páginas estáticas de Next necesitan scripts en línea para hidratarse. La alternativa (nonces por petición) obliga a
renderizar cada página en cada visita y pierde la caché de CDN. Para una web sin sesiones ni datos sensibles se ha priorizado el
rendimiento con el resto de la CSP cerrado. React escapa todo el contenido y el único HTML inyectado (JSON-LD) escapa `<`.

**Endurecimiento opcional**: `src/proxy.ts` con el ejemplo de nonces de la guía de Next
(`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`), `'nonce-…' 'strict-dynamic'` y render dinámico.

## Secretos y variables de entorno

- Ningún secreto en el código ni en el navegador (comprobado: los bundles de `.next/static` no contienen nombres de variables de
  servidor). `.env*` está en `.gitignore`; la plantilla es `.env.example`.
- Variables de servidor: `HOJA_WEBHOOK_URL`, `HOJA_WEBHOOK_SECRETO` y, como alternativa para el formulario, `RESEND_API_KEY`,
  `CONTACT_TO`, `CONTACT_FROM`. Las `NEXT_PUBLIC_*` son identificadores públicos (GTM, GA4, Pixel) y se validan antes de usarse.
- Los enlaces externos se abren con `noopener noreferrer`; el mensaje de WhatsApp se codifica con `encodeURIComponent`.

## Dependencias

`npm audit --omit=dev`: 0 vulnerabilidades (30/09/2026). Revisar con `npm audit` y `npm outdated` en cada actualización.

## Cuentas del negocio

- Verificación en dos pasos en Google, GitHub y Vercel (ver `docs/PUBLICAR.md`).
- La clave secreta de la hoja solo se pega en Vercel. Si se filtra: Apps Script → Propiedades del script → borrar `SECRETO` →
  *Web → Preparar las hojas* genera otra → actualizarla en Vercel y volver a publicar.

## Privacidad (RGPD / LSSI)

- Sin cookies ni rastreo antes del consentimiento. «Rechazar» con el mismo peso que «Aceptar». Cambiable desde el pie.
- Formularios con consentimiento explícito. Solicitudes y mensajes solo se guardan en la hoja de Google de Umotion, y así lo
  dice la política de privacidad.
- Textos legales en borrador con los campos a completar marcados (ver `docs/PENDIENTES.md`).
