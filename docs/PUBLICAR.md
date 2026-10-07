# Puesta en marcha: de la web terminada a Umotion funcionando

Guía paso a paso para dejar la web publicada, a nombre de Umotion y con todo conectado: solicitudes de diagnóstico por
WhatsApp y Gmail, hoja de seguimiento, formulario, estadísticas y buscadores. Tiempo total: una mañana (3–4 horas), casi todo
esperando a que Google o el dominio confirmen.

**Principio**: todas las cuentas son **de Umotion** (con su correo) y tú (quien hace la web) entras como colaborador.

---

## 0. Antes de empezar: qué hay que tener

| Qué | Para qué | Quién |
|---|---|---|
| Móvil con el **633 27 59 09** (el WhatsApp de Umotion) | WhatsApp Business y verificaciones | Umotion |
| **Nombre de dominio** elegido (p. ej. `umotion.es`) y tarjeta para comprarlo | La dirección de la web | Umotion |
| Datos legales: **razón social o nombre, NIF, domicilio** | Aviso legal y privacidad (obligatorio) | Umotion / asesoría |
| Correo de contacto (se crea en el paso 1) | Avisos y textos legales | Umotion |
| Tarjeta de pago | Vercel Pro y renovación del dominio | Umotion |
| Esta carpeta del proyecto (`Prototipo web`) | Subirla a internet | Tú |

**Costes**: Vercel Pro (cuota mensual; precio actual en vercel.com/pricing: el plan gratuito no permite uso comercial) +
dominio (anual, suele rondar 10–20 € un `.es`). Todo lo demás es gratis: Gmail, Sheets, Analytics, Search Console, Perfil de
Empresa y WhatsApp Business.

---

## 1. Cuenta de Google de Umotion (15 min)

1. La cuenta es **umotionzaragoza@gmail.com** (si aún no existe: accounts.google.com → Crear cuenta → Para mi trabajo o mi empresa).
2. **myaccount.google.com → Seguridad → Verificación en dos pasos**: activarla.
3. Con esta cuenta se hacen los pasos 2, 3, 7, 8 y 9. Es el correo que ya muestra la web.

## 2. Hoja de solicitudes (20 min)

1. Con la cuenta de Umotion, en **sheets.google.com** → hoja en blanco → nombre «Solicitudes web — Umotion».
2. **Extensiones → Apps Script**.
3. Borrar lo que hay en `Código.gs`, pegar todo [`integraciones/hoja-de-solicitudes/Codigo.gs`](../integraciones/hoja-de-solicitudes/Codigo.gs) y pulsar **guardar**.
4. Arriba, elegir la función **`prepararHojas`** → **Ejecutar**. Google pide permisos: **Revisar permisos → la cuenta → Configuración avanzada → Ir a «…» (no seguro) → Permitir** (sale porque el script es propio, es normal).
5. Volver a la hoja y recargar: aparecen el menú **Web** y las pestañas *Resumen, Solicitudes y Mensajes*.
6. **Implementar → Nueva implementación → ⚙ → Aplicación web**. Descripción «Web», **Ejecutar como: Yo**, **Quién tiene acceso: Cualquier usuario** → **Implementar** → copiar la **URL** (termina en `/exec`) = `HOJA_WEBHOOK_URL`.
7. En la hoja: **Web → Ver la clave secreta (para Vercel)** → copiarla = `HOJA_WEBHOOK_SECRETO`.
8. **Web → Enviar un correo de prueba**: debe llegar al Gmail (mirar spam la primera vez y marcar «No es spam»).

## 3. GitHub: la copia maestra del código (15 min)

1. **github.com → Sign up** con el correo de Umotion. Activar la verificación en dos pasos.
2. **New repository** → `web-umotion` → **Private** → *Create repository*.
3. En la carpeta del proyecto:
   ```bash
   git remote add origin https://github.com/<usuario-de-umotion>/web-umotion.git
   git push -u origin main
   ```
4. **Settings → Collaborators → Add people**: añadirte a ti.

## 4. Vercel: publicar la web (20 min)

1. **vercel.com → Sign Up → Continue with GitHub** (la cuenta de GitHub de Umotion).
2. Contratar **Pro** (Settings → Billing) con la tarjeta de Umotion.
3. **Add New… → Project** → importar `web-umotion`.
4. Antes de *Deploy*, en **Environment Variables**:

   | Nombre | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<dominio>` (el definitivo, p. ej. `https://umotion.es`) |
   | `HOJA_WEBHOOK_URL` | la URL `/exec` del paso 2.6 |
   | `HOJA_WEBHOOK_SECRETO` | la clave del paso 2.7 |

5. **Deploy**. En 2–3 minutos está en `https://web-umotion-xxxx.vercel.app`.
6. Pestaña **Analytics → Enable** (visitas sin cookies).

## 5. Probarlo todo (15 min)

Desde el móvil, en la dirección de prueba:
1. **Diagnóstico** → marcar tipo de negocio y tareas → nombre → aceptar privacidad → **Enviar por WhatsApp**. Comprobar:
   - [ ] WhatsApp se abre con la solicitud escrita y un número tipo `D-261001-4F7K`.
   - [ ] Llega el correo «Nuevo diagnóstico D-…» al Gmail de Umotion.
   - [ ] Aparece la fila en *Solicitudes* con estado **Nueva** (en azul claro).
2. **Contacto** → mensaje de prueba: llega el correo y aparece en *Mensajes*.
3. Borrar las filas de prueba.

## 6. Dominio (30 min + espera)

1. Comprar el dominio en un registrador (DonDominio, IONOS, Namecheap…) a nombre de Umotion. Se puede comprar también dentro de Vercel (Domains → Buy).
2. En Vercel: **Settings → Domains → Add** → `umotion.es` y `www.umotion.es` (aceptar la redirección que propone).
3. Copiar los **registros DNS** que muestra Vercel en la zona DNS del registrador (un `A` para `@` y un `CNAME` para `www`).
4. Esperar a **Valid Configuration** (minutos a horas). El HTTPS se crea solo.
5. Si el dominio no era el de `NEXT_PUBLIC_SITE_URL`, corregir la variable y **Redeploy**.

## 7. Google Analytics 4 (15 min)

1. **analytics.google.com** → cuenta «Umotion» → propiedad «Web Umotion», España, euro.
2. **Flujo de datos → Web** → el dominio → copiar el **ID** `G-XXXXXXX`.
3. Vercel → Environment Variables → `NEXT_PUBLIC_GA4_ID` = ese ID → **Redeploy**.
4. Abrir la web, aceptar cookies y verlo en **Informes → Tiempo real**.
5. **Administrar → Eventos clave**: `generate_lead` (diagnóstico solicitado), `click_whatsapp`, `click_llamar`, `contacto_enviado`.
6. **Acceso a la propiedad**: añadirte como *Editor*.

## 8. Google Search Console (15 min + espera)

1. **search.google.com/search-console → Añadir propiedad → Dominio** → `umotion.es`.
2. Añadir el registro **TXT** que da Google en el DNS → **Verificar**.
3. **Sitemaps** → `sitemap.xml` → **Enviar**.

## 9. Perfil de Empresa de Google (15 min + verificación)

1. **business.google.com → Añadir empresa** → «Umotion», categoría «Consultor» o «Servicio de consultoría informática».
2. ¿Tiene un local que visitan los clientes? **No** → zona de servicio: Zaragoza.
3. Teléfono 633 27 59 09, web `https://umotion.es`, horario L–S 9:00–20:00.
4. Verificar (Google indica el método: vídeo, llamada o correo).

## 10. WhatsApp Business en el móvil de Umotion (20 min)

1. Instalar **WhatsApp Business** con el 633 27 59 09 (si usaba WhatsApp normal, la app traspasa los chats).
2. **Perfil**: descripción («Automatización e IA para negocios de Zaragoza. Diagnóstico gratuito»), horario, web.
3. **Etiquetas** iguales a la hoja: «Nueva», «Diagnóstico agendado», «Propuesta enviada», «Cliente».
4. **Respuestas rápidas**, p. ej. `/cita`: «¡Hola! Gracias por pedir el diagnóstico. ¿Te va bien [día] a las [hora], [en tu negocio / por videollamada]?»
5. **Mensaje de ausencia** fuera de horario: «Gracias por escribir. Atendemos de lunes a sábado de 9:00 a 20:00; te respondemos en cuanto volvamos.»

## 11. Textos legales y datos finales

1. Con la asesoría, completar lo marcado entre corchetes en **Aviso legal, Privacidad, Cookies, Condiciones y Accesibilidad**.
2. Si hay redes sociales, añadirlas en `src/data/negocio.ts` (`redes`).
3. Quitar el aviso de borrador (`borrador={false}` en cada página legal), subir a GitHub y Vercel publica solo.
4. Repasar `docs/PENDIENTES.md`.

## 12. Entrega a Umotion

| Servicio | Dirección | Cuenta | Tú como… |
|---|---|---|---|
| Hoja de solicitudes | sheets.google.com | Gmail de Umotion | Editor |
| Web | vercel.com | GitHub de Umotion | Colaborador |
| Código | github.com | Umotion | Colaborador |
| Estadísticas | analytics.google.com · Vercel → Analytics | Gmail de Umotion | Editor |
| Google | Search Console · Perfil de Empresa | Gmail de Umotion | Usuario |
| Dominio | registrador | Umotion | — |
| WhatsApp Business | móvil 633 27 59 09 | — | — |

---

## Rutina de Umotion

**Cada solicitud**
1. Llega el WhatsApp (con el número `D-…`) y el correo «Nuevo diagnóstico».
2. Responder por WhatsApp para quedar (`/cita`) y en la hoja poner **Contactado** y la fecha en *Próximo paso*.
3. Al cerrar el día y la forma: **Diagnóstico agendado** → después **Diagnóstico hecho** → **Propuesta enviada** → **Cliente** o **Descartada**.
   Una solicitud en **Nueva** sin WhatsApp es que la persona no llegó a enviarlo: se le puede llamar si dejó teléfono.

**Cada día**: *Resumen* → nuevas sin contactar, seguimientos vencidos y mensajes sin atender (marcar «Atendido»).

**Cada semana**: *Resumen* → solicitudes de la semana y por tipo de negocio. Vercel → Analytics: visitas y diagnósticos solicitados.

**Cada mes**: GA4 (de dónde llegan), Search Console (qué buscan en Google), Perfil de Empresa (llamadas). Con eso se decide
qué sector trabajar más y qué ejemplos añadir.

## Si algo falla

| Síntoma | Qué mirar |
|---|---|
| Se abre WhatsApp pero no aparece en la hoja | Vercel → `HOJA_WEBHOOK_URL` y `HOJA_WEBHOOK_SECRETO` sin espacios → *Redeploy*. Apps Script → *Ejecuciones*. El WhatsApp funciona igual. |
| No llegan correos | Spam; Apps Script → *Ejecuciones*. Gmail permite unos 100 avisos al día por script. |
| La web no carga en el dominio | Vercel → Domains: los DNS deben coincidir exactamente. |
| GA4 no muestra visitas | Solo cuenta a quien acepta cookies; revisar `NEXT_PUBLIC_GA4_ID` y *Redeploy*. |
