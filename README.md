# Portal del Huésped — Hotel Vitae

Portal web para el huésped que ya está hospedado: wifi, llave, reglas, transporte, alimentación, emergencias (con mapa de evacuación en Galery), videos tutoriales, servicios adicionales y guía. Se abre desde un QR en la habitación, un enlace por WhatsApp o un botón en la web.

Es un **sitio estático**: HTML, CSS y JavaScript sin framework, sin compilación y sin backend. Esa fue una decisión deliberada (ver «Decisiones de arquitectura»).

## Requisitos

| Para | Necesitas |
|---|---|
| Ver el portal | Un navegador moderno. Doble clic en `index.html` funciona; para probar como en producción usa `npm start`. |
| Ejecutar pruebas y herramientas | Node.js 20 o superior |
| Pruebas en navegador | Playwright + Chromium (ver abajo) |

Internet solo se usa para las tipografías de Google Fonts (si fallan, el portal usa una fuente del sistema).

## Instalación y comandos

```bash
npm install                  # solo hace falta para lint, formato y pruebas e2e
npm start                    # servidor local en http://localhost:8080
npm test                     # pruebas unitarias (no necesitan dependencias)
npx playwright install chromium   # una sola vez, para las pruebas e2e (Playwright va fijado a 1.56.1)
npm run test:e2e             # flujos completos en navegador real, incluido móvil
npm run lint                 # ESLint (JS) y stylelint (CSS)
npm run format               # revisa el formato con Prettier (format:fix lo corrige)
npm run verificar            # lint + formato + pruebas unitarias + e2e, todo en uno
```

No hay comando de compilación: lo que está en el repositorio es lo que se publica. **No hay variables de entorno ni credenciales**; el portal no tiene backend. La clave de wifi es información pública para los huéspedes.

## Estructura

```
index.html                 Estructura, diálogos y orden de carga de los scripts
css/                       Estilos por tema, cargados en este orden (la cascada depende de él):
  base.css                 Variables de marca (:root), reinicio y utilidades
  layout.css               Encabezado, menú de navegación y contenedores
  inicio.css               Selector de sede, portada, aviso y accesos
  videos.css               Tarjetas, biblioteca, reproductor y videos por sección
  detalle.css              Encabezados, acordeones y bloques comunes de detalle
  responsive.css           Ajustes de escritorio y pantallas pequeñas
  secciones.css            Pestañas, alimentación, wifi, traslados, reglas, emergencias, contacto, guía
  accesibilidad.css        Letra grande, alto contraste, menos movimiento
  servicios.css  mapa.css  Servicios adicionales y mapa de evacuación
js/
  config.js                CONFIG (modo prueba), claves de localStorage
  core/
    utils.js               Formato, hora de Colombia, almacenamiento seguro, escape de HTML
    router.js              Identificación de sede (URL/guardada/manual) y navegación por hash
    acciones.js            ACCIONES y despachador de eventos (reemplaza a los onclick)
  data/                    Contenido editable, sin lógica
    portal.js              SEDES, SERVICIOS (enlaces Mary Kay), AVISOS, ITEMS (tarjetas del inicio)
    contenido.js           GLOBAL (reglas, transporte, emergencias, guía) y «¿Se puede…?»
    videos.js              VIDEOS y CATEGORIAS
    mapa-galery.js         Plano de Galery: habitaciones, puertas, salidas
  features/                Una pantalla o funcionalidad por archivo
    home.js  videos.js  detalle.js  comidas.js  traslados.js
    reglas.js  emergencias.js  guia.js  mapa.js  a11y.js
  main.js                  Arranque: eventos, preferencias y pantalla inicial
assets/                    logo, íconos, videos (video-NN.mp4), portadas, QR de wifi
scripts/servir.js          Servidor estático sin dependencias
tests/unit/                Pruebas de lógica y de integridad de los datos
tests/e2e/flujos.js        Pruebas de flujos en navegador (Playwright)
```

Los scripts son clásicos (no módulos) y comparten el ámbito global; **el orden en `index.html` importa**: config → utils → data → router → features → acciones → main. Las pruebas leen ese mismo orden desde `index.html`.

## Tareas habituales

**Cambiar contenido** (textos, teléfonos, horarios): editar `js/data/`. Los horarios de comida están en `js/features/comidas.js` (`COMIDAS`).

**Nueva sede**: una entrada en `SEDES` (`data/portal.js`) con su `slug`, wifi y teléfono. Si tiene videos propios, `sedes:['sX']` en el video. Su QR físico apunta a `index.html?sede=<slug>`. No se toca ningún otro archivo.

**Nuevo video**: una línea en `VIDEOS`. Por convención `vN` usa `assets/videos/video-NN.mp4` y `assets/posters/video-NN.jpg`; también admite `yt:'ID'` o `subs:'ruta.vtt'`.

**Nueva sección**: agregar su entrada en `ITEMS` y su renderizador en `DETALLE_VISTAS` (`features/detalle.js`). Si es solo de algunas sedes, `sedes:[...]`. Una prueba falla si falta alguno de los dos.

**Servicios Mary Kay**: los enlaces están en `SERVICIOS.marykay`. Si un enlace queda vacío, el portal muestra «Enlace pendiente».

**Publicar sin notas internas**: `CONFIG.modoPrueba = false` oculta la nota de «selección temporal» cuando los QR ya estén en producción.

## Identificación de sede y QR

Todos los caminos terminan en `fijarSede(id, origen)` (`core/router.js`). Hoy se usa el selector manual o `?sede=galery|galerias|corferias`. Cuando existan los QR no hay que reconstruir nada: cada uno solo apunta a la URL con su `?sede=`. Un valor desconocido se ignora y se muestra el selector.

## Decisiones de arquitectura

- **Sin framework ni compilación.** El portal es pequeño, se abre desde un QR en celulares y lo mantiene un equipo reducido; un sitio estático se publica en cualquier hosting y no tiene dependencias que actualizar. Si crece mucho (cuentas, reservas, backend), migrar a un framework sería razonable.
- **Datos separados de la lógica.** Lo que cambia con frecuencia (contenido, sedes, videos) está en `js/data/`; las sedes no se implementan con componentes duplicados sino con datos.
- **Eventos delegados, sin `onclick`.** El HTML generado marca los elementos con `data-act="nombre"` (helper `da()`/`daEvento()` en `utils.js`) y un solo oyente por tipo de evento en `core/acciones.js` ejecuta `ACCIONES[nombre]`. Para un botón nuevo: agrega la acción en `ACCIONES` y úsala con `da('nombre', arg)`.
- **Política CSP** (`<meta>` en `index.html`): `script-src 'self'`, sin scripts en línea. Los estilos en línea (`style="…"`) siguen permitidos porque se usan para anchos de barras y tamaños puntuales. Si agregas un servicio externo (analítica, otro CDN), hay que añadirlo a la política o el navegador lo bloqueará.
- **Plantillas HTML con datos propios.** Todo el texto que se inserta viene de archivos del repositorio; la única entrada externa (`?sede=`) se valida contra la lista de sedes y nunca se inserta en el HTML. Si algún día se muestra texto escrito por usuarios, hay que pasarlo por `esc()`.
- **Hora de Colombia.** Alimentación y traslados usan `bogota()`, no la hora del dispositivo.
- **Almacenamiento local** (`almacen`): sede, videos vistos y accesibilidad. Falla en silencio si el navegador lo bloquea.

## Estado del contenido

| Dato | Estado |
|---|---|
| Sedes, direcciones, teléfonos, reglas, transporte, alimentación, emergencias | Real |
| Wifi Galery (con QR) | Real |
| Wifi Galerías y Corferias | Pendiente del cliente |
| Mapa de evacuación | Solo Galery, basado en el plano oficial; es esquemático y no está a escala |
| Servicios adicionales (Mary Kay) | Solo Galery; enlaces del catálogo y del escaneo de piel configurados |
| Normas y estándares aplicables | Ver `Documentación normativa` |

## Para quien mantenga el código

- Antes de subir cambios: `npm run verificar`.
- **Contraste:** el e2e mide WCAG AA con axe-core en todas las pantallas (normal y alto contraste). Si cambias colores y falla, ajusta el color; no desactives la prueba. Lo que axe no puede medir (texto sobre imágenes o video) se revisa a mano.
- **Imágenes:** `assets/logo_vitae.png` es una versión liviana (400 px, paleta); el original está en `assets/originales/`.
- Las pruebas de datos revisan que existan los videos, portadas, íconos y QR referenciados, que no haya ids repetidos y que cada sección tenga su pantalla.
- Los textos visibles y los comentarios están en español.
- Revisar manualmente en un celular real el reproductor de video (autoplay y pantalla completa varían por navegador).
