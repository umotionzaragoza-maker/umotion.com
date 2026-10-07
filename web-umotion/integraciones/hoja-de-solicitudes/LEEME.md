# Hoja de solicitudes (Google Sheets + Apps Script)

El panel de control comercial de Umotion, sin servidores ni cuotas: una hoja de Google de su propia cuenta.

- **Solicitudes**: cada petición de diagnóstico enviada desde la web, con el mismo número `D-…` que el mensaje de WhatsApp.
  Columna *Estado* (Nueva → Contactado → Diagnóstico agendado → Diagnóstico hecho → Propuesta enviada → Cliente / Descartada),
  *Próximo paso* (fecha de seguimiento) y *Notas*.
- **Mensajes**: el formulario de contacto.
- **Resumen**: solicitudes de 7 y 30 días, nuevas sin contactar, diagnósticos agendados, propuestas, clientes, seguimientos
  vencidos, mensajes sin atender, solicitudes por tipo de negocio y lista de seguimientos pendientes.
- Avisos por correo desde el Gmail de Umotion para cada solicitud y cada mensaje.

## Cómo encaja con la web

```
La persona pulsa «Enviar por WhatsApp» en /diagnostico
 ├─ se abre su WhatsApp con la solicitud escrita  ──► WhatsApp Business de Umotion
 └─ POST /api/diagnostico (en segundo plano)
      └─ valida la solicitud (listas cerradas, tamaños, antispam)
           └─ POST a la aplicación web del script (HOJA_WEBHOOK_URL + clave HOJA_WEBHOOK_SECRETO)
                ├─ fila en Solicitudes (estado «Nueva»)
                └─ correo «Nuevo diagnóstico D-…» al Gmail de Umotion
```

El formulario de contacto sigue el mismo camino (`/api/contacto` → hoja *Mensajes* + correo). Si la hoja falla o no está
conectada, la solicitud por WhatsApp funciona igual.

## Instalación

Pasos exactos en `docs/PUBLICAR.md` (paso 2). En resumen: hoja nueva → Extensiones → Apps Script → pegar `Codigo.gs` →
ejecutar `prepararHojas` → autorizar → Implementar como aplicación web (Ejecutar como: Yo · Acceso: Cualquier usuario) →
copiar la URL `/exec` y la clave de *Web → Ver la clave secreta* en Vercel.

## Seguridad

- Sin la clave secreta, la aplicación web no escribe nada. «Cualquier usuario» solo permite *enviar* con esa clave; nadie puede leer la hoja.
- Si la web reintenta una solicitud con el mismo número, no se duplica.
- Lo que empieza por `= + - @` se guarda como texto (sin fórmulas inyectadas) y el correo de aviso escapa el HTML.
- Probado en `tests/hoja.test.ts` con una imitación de Sheets y Gmail.

## Qué cambiar para otro negocio

Solo la constante `NEGOCIO` al principio de `Codigo.gs` (y los estados en `ESTADOS` si el embudo es distinto).
