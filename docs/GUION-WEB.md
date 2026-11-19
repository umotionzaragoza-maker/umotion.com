# Guion de la portada cinemática (v3)

Portada de umotion.com contada como una película en seis capítulos. Mientras el visitante baja, un mismo haz de
fibras de luz (Three.js, en tiempo real, sin vídeo) cambia de forma en cada capítulo: cuelga, se enreda, se abre
como un ojo, se convierte en una ola, forma una red y, al final, dibuja la U de Umotion.

Estilo tomado de la referencia «Future-State» (motionsites.ai): fondo negro azulado, fibras con puntas de luz,
titulares grandes en mayúsculas con una palabra en cursiva, «//» delante de la última línea, contador de capítulo
`( A ) 001 / 006`, navegación mínima con flechas ↗ y botón de contorno en píldora. No se copia ningún recurso de
la referencia: la animación se genera con código y el texto es propio.

El texto que se ve en la web sale de `src/data/guion.ts`. Este documento es el guion completo, con la intención
de cada escena, para revisarlo antes de cambiar nada.

Regla del guion: solo se afirma lo que Umotion ha confirmado (servicios, diagnóstico gratuito, forma de contacto,
horario). Sin precios, sin cifras de resultados, sin casos de clientes y sin testimonios: no existen todavía.
Lo que falta está al final.

---

## Capítulo A · 001 / 006 — «Más clientes»

**Imagen.** Cientos de fibras de luz cuelgan desde arriba y se mecen. Cada punta brilla como una gota. Si mueves el
ratón, la cámara se inclina un poco hacia él.

**Intención.** En cinco segundos, el visitante sabe qué vendemos y para quién, y tiene el botón delante.

**Etiqueta:** Umotion · Webs, marketing e IA para negocios

**Titular:**
> MÁS CLIENTES,
> *menos* TRABAJO
> // REPETITIVO

**Texto:**
> Webs que traen contactos, marketing que te hace visible y automatizaciones con inteligencia artificial que hacen
> solas las tareas de siempre. Para dueños de negocios que no tienen tiempo de pelearse con la tecnología.

**Botón principal:** Pide tu diagnóstico gratis → `/diagnostico`
**Botón secundario:** Escríbenos por WhatsApp

**Datos al pie:** Primer diagnóstico gratuito · En tu negocio o por videollamada · Estado de atención en vivo
(«Atendemos ahora · hasta 20:00», sale del horario real).

**Indicación:** «Desliza» con una línea que late.

---

## Capítulo B · 002 / 006 — «El problema»

**Imagen.** Las fibras se recogen y se enredan en una maraña que gira despacio: el día a día de un negocio sin
sistema.

**Intención.** Que el dueño se reconozca. Sin exagerar ni dar cifras: escenas que vive cada semana.

**Etiqueta:** El día a día

**Titular:**
> TU DÍA SE VA
> *en lo que*
> // NO VENDE

**Texto:**
> Coger el teléfono en plena hora punta. Apuntar reservas a mano. Buscar la factura que pide la gestoría.
> Responder por quinta vez la misma pregunta. Nada de eso es tu negocio, pero se come tus horas.

**Lista (cuatro escenas, una por tipo de negocio, sacadas de los ejemplos de `sectores.ts`):**
1. Hostelería — Reservas por WhatsApp que alguien tiene que apuntar.
2. Comercio — Encargos y existencias que se controlan de memoria.
3. Profesionales — Citas, correos y documentos que se ordenan a mano.
4. Pymes — Contactos, presupuestos y datos que el equipo copia de un programa a otro.

**Remate:**
> Y mientras tanto, quien te busca desde el móvil puede acabar en el negocio de al lado.

---

## Capítulo C · 003 / 006 — «Que te vean»

**Imagen.** La maraña se ordena en un iris: fibras que salen del centro hacia fuera y un anillo blanco de radios
alrededor. Un ojo que mira. Es lo que necesitas: que te vean.

**Intención.** Vender webs, tienda online y marketing.

**Etiqueta:** Webs, tiendas online y marketing

**Titular:**
> QUE TE VEAN,
> *que te* ELIJAN
> // Y TE ESCRIBAN

**Texto (de la familia «presencia»):**
> Una web clara, una tienda que vende sola y un marketing con los pies en el suelo para que lleguen más clientes de
> tu zona.

**Tres tarjetas (de `servicios.ts`):**
- **Web para tu negocio.** Una web clara que trae contactos. Diseño adaptado al móvil · Textos claros y formulario o
  WhatsApp · Preparada para Google y medición de contactos.
- **Tienda online.** Vender por internet sin complicarte. Catálogo, pagos y envíos · Avisos de pedidos y existencias
  · Fácil de actualizar por ti.
- **Marketing digital.** Que más gente de tu zona te conozca. Plan de contenidos y redes sociales · Campañas en
  Google y redes · Medición de contactos y ventas.

**Botón:** Ver todos los servicios ↗ → `/servicios`

---

## Capítulo D · 004 / 006 — «Que se haga solo»

**Imagen.** El iris se abre y cae en un arco de filamentos que se ondula como un campo de trigo al viento:
trabajo que avanza sin que lo empujes.

**Intención.** Vender automatización con IA con ejemplos concretos y elegibles por sector.

**Etiqueta:** Automatización con IA

**Titular:**
> QUE SE HAGA
> // *solo*

**Texto:**
> Conectamos tus herramientas y automatizamos las tareas repetitivas para que el dato se escriba una vez y el resto
> ocurra solo. Elige tu tipo de negocio:

**Selector por sector** (Hostelería · Comercio · Profesionales · Pymes), cada uno con sus cuatro reglas
«Cuando… → Entonces…» de `sectores.ts`. Ejemplo de Hostelería:
- Cuando entra una reserva por WhatsApp o por la web → se apunta en tu agenda y el cliente recibe la confirmación.
- Cuando se acerca la hora de la reserva → el cliente recibe un recordatorio y puede avisar si no viene.
- Cuando cierras la caja → te llega al móvil el resumen del día.
- Cuando llegan las facturas de proveedores → se ordenan solas en una hoja para tu gestoría.

**Nota pequeña:** Ejemplos de lo que se puede automatizar, no casos de clientes.

**Botón:** Ver más ejemplos ↗ → `/ejemplos`

---

## Capítulo E · 005 / 006 — «Primero, entender»

**Imagen.** El arco se cierra en una esfera de rutas que gira: el mapa completo del negocio.

**Intención.** Vender análisis y consultoría, y quitar el miedo a «que me vendan algo que no necesito».

**Etiqueta:** Análisis y consultoría

**Titular:**
> PRIMERO,
> // *entender*

**Texto:**
> Antes de proponer nada, miramos cómo funciona tu negocio. Sales sabiendo qué mejorar primero y por qué.

**Tres bloques (de `servicios.ts`):**
- **Diagnóstico gratuito.** Una conversación de trabajo sobre tu negocio.
- **Análisis del negocio.** Saber dónde estás y qué mejorar primero.
- **Consultoría digital e IA.** Decidir con criterio qué herramientas usar.

**Cuatro principios (de `metodo.ts`):** Primero, entender · Con lo que ya usas · Paso a paso · Tú decides.

---

## Capítulo F · 006 / 006 — «El primer paso es gratis»

**Imagen.** Todas las fibras viajan hasta dibujar la U de Umotion con su flecha hacia arriba, y brillan.

**Intención.** Cerrar: quitar riesgo (gratis, sin compromiso de contratar, precio antes de empezar) y dar tres
maneras de dar el paso.

**Etiqueta:** Cómo empezamos

**Titular:**
> EL PRIMER PASO
> *es*
> // GRATIS

**Texto:**
> Una conversación de trabajo en tu negocio o por videollamada. Nos cuentas cómo trabajas y te decimos qué
> mejorar y por dónde empezaríamos. Sin coste.

**Cuatro pasos (de `metodo.ts`):**
1. Diagnóstico gratuito — Sabes qué se puede automatizar y qué no.
2. Propuesta — Precio y alcance claros antes de empezar.
3. Puesta en marcha — Probado con tus casos reales.
4. Seguimiento — Tu negocio sigue mejorando paso a paso.

**Dudas rápidas (de `faq.ts`):** ¿Necesito saber de tecnología? · ¿Tengo que cambiar los programas que ya uso? ·
¿Cuánto cuesta?

**Panel final:**
> Elige cómo prefieres empezar. Atendemos de lunes a sábado; te respondemos para acordar día y forma.

**Botones:** Diagnóstico gratis · WhatsApp · Instagram (mensaje directo a @umotion.ia)

**Cierre:** el pie de la web, que ya remata con «Menos tareas. *Más negocio.*» y los botones de diagnóstico y
WhatsApp.

---

## Lo que falta (no se ha inventado)

- **umotion Academy.** No hay en el proyecto ni en la web ningún dato de la academia (qué enseña, formato, precio,
  enlace). Sin eso no se puede poner en la portada. El guion tiene previsto un capítulo para ella en cuanto exista.
- **Creación de contenido con IA** como servicio de cara al cliente: no está en `servicios.ts`. Hace falta su
  descripción (qué se entrega, para quién) para añadirlo como servicio.
- **Precios** o «desde»: no hay. La web sigue diciendo «a consultar» y «precio antes de empezar».
- **Casos reales y testimonios** con permiso del cliente: no hay. Serían la mejor prueba en el capítulo C o D.
- **Portafolio**: el Instagram @umotion.ia hace de portafolio; si hay trabajos de clientes publicables, falta la lista.
- **Confirmación de los pasos 2–4 del método y de los principios** (ya pendiente en `docs/PENDIENTES.md`).
- **Dominio definitivo** (`SITE_URL` sigue en `umotion.es` provisional) y datos legales.
