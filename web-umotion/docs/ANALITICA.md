# Analítica y medición de la conversión

## Dos niveles

| | Vercel Web Analytics | Google Analytics 4 (vía GTM) |
|---|---|---|
| A quién cuenta | **A todos los visitantes** | Solo a quien acepta la analítica |
| Cookies | Ninguna | Sí, tras el consentimiento |
| Qué da | Visitantes, páginas vistas, de dónde llegan, país, dispositivo y las conversiones principales | Todo lo anterior con más detalle: recorridos, embudo del formulario, campañas |
| Dónde se ve | Panel de Vercel → *Analytics* | analytics.google.com |

### Vercel Web Analytics

- Se carga solo en las compilaciones hechas en Vercel; en local no hace nada.
- **Activarlo** en Vercel → proyecto → *Analytics* → *Enable* y volver a publicar.
- Conversiones que recibe, solo con datos agregados (nunca nombres, teléfonos ni textos):

  | Evento en el panel | Cuándo | Datos |
  |---|---|---|
  | Diagnóstico solicitado | `generate_lead` | origen, tipo de negocio, lugar, nº de tareas marcadas |
  | Clic en WhatsApp | `click_whatsapp` | origen |
  | Clic en llamar | `click_llamar` | origen |
  | Mensaje de contacto enviado | `contacto_enviado` | motivo |

  La lista está en `CONVERSIONES` (`src/lib/analytics.ts`) y la cubren las pruebas de `tests/analitica.test.ts`.

## Cómo funciona GA4

Todos los eventos pasan por `track()` y **solo salen del navegador si el usuario ha aceptado la analítica**. Se empujan a
`window.dataLayer` con nombres estándar de GA4, así que Google Tag Manager los reenvía sin transformarlos.

El cargador (`src/components/cookies/Analitica.tsx`) carga, tras el consentimiento: **GTM** si hay `NEXT_PUBLIC_GTM_ID`;
**GA4 directo** si no hay GTM pero sí `NEXT_PUBLIC_GA4_ID`; **Meta Pixel** si hay `NEXT_PUBLIC_META_PIXEL_ID` y se acepta la
publicidad. Sin variables no se carga nada.

## Eventos

| Evento | Cuándo | Datos |
|---|---|---|
| `form_start` | Primer campo tocado del formulario de diagnóstico | `origen` |
| **`generate_lead`** | **Enviar la solicitud de diagnóstico por WhatsApp** (la conversión principal) | tipo de negocio, lugar, nº de tareas |
| `click_whatsapp` | Cualquier botón de WhatsApp | `origen` (héroe, barra móvil, pie…) |
| `click_llamar` | Botones de llamada | `origen` |
| `click_email` | Enlaces de correo (cuando haya correo) | `origen` |
| `contacto_enviado` / `contacto_error` | Formulario de contacto | motivo / código |
| `cta_click` | Botones principales (héroe, cabecera, barra móvil) | `cta`, `origen` |

## Configuración en GTM (resumen)

1. Etiqueta de configuración GA4 en todas las páginas.
2. Etiqueta de evento GA4 con disparador «Evento personalizado» `.*` (regex) y parámetros de la capa de datos (`origen`, `cta`, `sector`, `modalidad`).
3. Eventos clave en GA4: `generate_lead`, `click_whatsapp`, `click_llamar`, `contacto_enviado`.
4. Meta Pixel: `Lead` en `generate_lead`, `Contact` en `click_whatsapp` y `click_llamar`.
5. Search Console: verificar con `NEXT_PUBLIC_GSC_VERIFICATION` y enviar `<dominio>/sitemap.xml`.

## Indicadores a seguir

- **Tasa de solicitud**: `generate_lead` / sesiones.
- **Abandono del formulario**: `form_start` sin `generate_lead`.
- **Contactos directos**: WhatsApp + llamadas, por origen.
- **Qué negocios llegan**: `generate_lead` por `sector` (y en la hoja, pestaña *Resumen*).
- **Embudo comercial real** (en la hoja): solicitudes → diagnósticos hechos → propuestas → clientes.
