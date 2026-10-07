# Imagen y fotografía

## Estado actual

Umotion no tiene fotos propias ni personas que mostrar (el cliente prefiere no publicar nombres). Por eso la web usa
**ilustraciones de marca**, no fotos de banco: todas comparten el mismo lenguaje (tinta azul noche, filamentos de luz azul →
cian como la U del logotipo, rejilla de puntos y grano) y se regeneran con un comando.

| Imagen | Dónde se usa | Archivo |
|---|---|---|
| Haz de luz que sube | Héroe, cabecera de /metodo, tarjeta para compartir | `heroe.jpg` |
| Esquema de 4 pasos de una automatización | Portada · Un ejemplo | `flujo.jpg` |
| La U hecha de luz | Portada · La idea, /ejemplos, /nosotros | `marca.jpg` |
| Planos de los 4 pasos | Portada · Cómo trabajamos, /metodo | `metodo.jpg` |
| Radar | Cabecera de /diagnostico | `diagnostico.jpg` |
| Ruta hasta un punto | Portada · Dónde, /contacto | `visita.jpg` |
| Taza, bolsa, documento, gráfico | Recorrido «Para quién» y /ejemplos | `sector-*.jpg` |

**Regenerarlas** (o crear variantes): editar `scripts/imagenes/generar.html` y ejecutar
`node scripts/imagenes/generar.mjs [escena]`. Usa el Chrome/Edge del equipo, sin instalar nada.
**Logotipo**: `node scripts/imagenes/logo.mjs` recorta `docs/marca/Umotion logo.png` en versiones para fondo claro y oscuro y el favicon.

## Si más adelante hay sesión de fotos

Dirección: luz natural, colores fríos, pantallas y manos trabajando, nunca poses de «ejecutivo con tablet». Lista de tomas:
1. Persona de Umotion en el mostrador de un negocio real, portátil abierto, conversando (con permiso del negocio).
2. Detalle de manos con el móvil y WhatsApp abierto (pantalla sin datos reales).
3. Videollamada vista desde atrás, con una hoja de cálculo en pantalla.
4. Plano general de Zaragoza al atardecer (para /nosotros).
5. Retrato del equipo, si el cliente decide mostrar caras.

Formato: JPG, lado largo ≥ 2400 px, sRGB. Se añaden en `src/assets/fotos/`, `src/lib/fotos.ts` y `src/data/creditos.ts` (tipo `real`).
