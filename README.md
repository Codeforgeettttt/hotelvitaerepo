# Portal del Huésped — Hotel Vitae

Portal web informativo para huéspedes alojados en Hotel Vitae. Permite consultar desde el celular, de forma rápida y sencilla, información sobre Wi-Fi, llaves, normas del hotel, transporte, alimentación, emergencias, servicios adicionales y videos tutoriales.

El portal está diseñado para abrirse mediante un código QR ubicado en la habitación, un enlace compartido por WhatsApp o un botón desde la página web del hotel.

## Características principales

- **Información del huésped:** acceso a reglas, horarios, alimentación y servicios disponibles.
- **Conectividad:** consulta de redes Wi-Fi y acceso al código QR correspondiente.
- **Videos tutoriales:** biblioteca de videos informativos organizados por categorías y secciones.
- **Transporte:** información sobre traslados y horarios.
- **Emergencias:** recomendaciones y mapa esquemático de evacuación para la sede Galery.
- **Servicios adicionales:** acceso a servicios complementarios, incluidos enlaces de Mary Kay.
- **Accesibilidad:** opciones de letra grande, alto contraste y reducción del movimiento.
- **Identificación de sede:** selección automática mediante parámetros de URL o selección manual.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y contenido del portal. |
| CSS3 | Diseño visual, estilos y adaptación a diferentes pantallas. |
| JavaScript | Navegación, interacciones y funcionalidades. |
| Node.js | Ejecución de herramientas de desarrollo y servidor local. |
| Playwright | Pruebas automatizadas de navegación en navegador. |
| axe-core | Evaluación automatizada de accesibilidad. |
| ESLint | Análisis estático del código JavaScript. |
| Stylelint | Validación de los estilos CSS. |
| Prettier | Formato consistente del código. |

**Arquitectura:** sitio web estático, sin frameworks, procesos de compilación ni backend.

## Requisitos

| Requisito | Descripción |
|---|---|
| Navegador | Navegador moderno compatible con HTML5, CSS3 y JavaScript. |
| Node.js | Versión 20 o superior para las herramientas de desarrollo. |
| Playwright + Chromium | Necesarios para ejecutar las pruebas automatizadas de navegador. |

El portal puede abrirse directamente desde `index.html`. Para probarlo mediante un servidor local, se recomienda utilizar `npm start`.

La conexión a Internet se utiliza únicamente para cargar las tipografías de Google Fonts. Si no están disponibles, se utiliza una fuente del sistema.

## Instalación y ejecución

### 1. Instalar dependencias

Desde la carpeta raíz del proyecto:

```bash
npm install
```

La instalación es necesaria para ejecutar las herramientas de análisis, formato y pruebas E2E.

### 2. Iniciar el servidor local

```bash
npm start
```

El portal estará disponible en:

```text
http://localhost:8080
```

### 3. Ejecutar las pruebas

**Pruebas unitarias:**

```bash
npm test
```

No requieren dependencias adicionales.

**Instalar Chromium para Playwright:**

```bash
npx playwright install chromium
```

Este paso se realiza una sola vez por entorno. La versión de Playwright está fijada en el proyecto (1.56.1).

**Pruebas E2E:**

```bash
npm run test:e2e
```

Ejecuta los flujos completos en un navegador real, incluyendo escenarios de visualización móvil.

### 4. Validar calidad y formato

```bash
npm run lint
npm run format
```

- `lint`: analiza JavaScript con ESLint y CSS con Stylelint.
- `format`: comprueba el formato del código con Prettier.

Para corregir automáticamente los problemas de formato:

```bash
npm run format:fix
```

### 5. Verificación completa

Antes de publicar cambios, ejecutar:

```bash
npm run verificar
```

Este comando reúne las validaciones del proyecto:

1. ESLint y Stylelint.
2. Verificación de formato con Prettier.
3. Pruebas unitarias.
4. Pruebas E2E.

> **Importante:** el proyecto no necesita un proceso de compilación. Los archivos del repositorio son los mismos que se publican.

## Estructura del proyecto

La organización separa los datos, la lógica y las funcionalidades para facilitar el mantenimiento y permitir incorporar nuevas sedes o secciones sin duplicar código.

```text
hotelvitae-portal/
│
├── index.html
│
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── inicio.css
│   ├── videos.css
│   ├── detalle.css
│   ├── responsive.css
│   ├── secciones.css
│   ├── accesibilidad.css
│   ├── servicios.css
│   └── mapa.css
│
├── js/
│   ├── config.js
│   ├── main.js
│   │
│   ├── core/
│   │   ├── utils.js
│   │   ├── router.js
│   │   └── acciones.js
│   │
│   ├── data/
│   │   ├── portal.js
│   │   ├── contenido.js
│   │   ├── videos.js
│   │   └── mapa-galery.js
│   │
│   └── features/
│       ├── home.js
│       ├── videos.js
│       ├── detalle.js
│       ├── comidas.js
│       ├── traslados.js
│       ├── reglas.js
│       ├── emergencias.js
│       ├── guia.js
│       ├── mapa.js
│       └── a11y.js
│
├── assets/
│   ├── originales/
│   ├── posters/
│   ├── videos/
│   ├── logo_vitae.png
│   ├── servicios.svg
│   └── wifi-galery.png
│
├── scripts/
│   └── servir.js
│
├── tests/
│   ├── unit/
│   └── e2e/
│       └── flujos.js
│
├── Documentación normativa/
├── .editorconfig
├── .gitignore
├── .prettierrc
├── .stylelintrc.json
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de los archivos principales

| Archivo o directorio | Responsabilidad |
|---|---|
| `index.html` | Estructura principal, diálogos y orden de carga de los scripts. |
| `css/` | Estilos organizados por secciones y funcionalidades. |
| `js/config.js` | Configuración general y modo de prueba. |
| `js/core/` | Utilidades, navegación y gestión centralizada de eventos. |
| `js/data/` | Información editable de sedes, servicios, contenido y videos. |
| `js/features/` | Implementación de las pantallas y funcionalidades. |
| `js/main.js` | Inicialización del portal y configuración de eventos. |
| `assets/` | Recursos gráficos, videos, portadas e imágenes. |
| `scripts/` | Herramientas auxiliares, incluido el servidor local. |
| `tests/unit/` | Pruebas de lógica e integridad de datos. |
| `tests/e2e/` | Pruebas de navegación e interacción en navegador. |
| `Documentación normativa/` | Documentación de normas y estándares aplicables. |

### Orden de carga de JavaScript

Los scripts utilizan el sistema clásico de JavaScript, sin módulos ES. Por tanto, comparten el ámbito global y su orden de carga en `index.html` es importante:

```text
config → utils → data → router → features → acciones → main
```

Las pruebas automatizadas utilizan este mismo orden para validar el funcionamiento del portal.

## Mantenimiento y ampliación

El proyecto está organizado para que las modificaciones habituales se puedan realizar sin afectar innecesariamente otras partes del código.

### Modificar contenido

Para cambiar textos, teléfonos, direcciones o información general, editar los archivos correspondientes dentro de:

```text
js/data/
```

Los horarios de alimentación se encuentran en:

```text
js/features/comidas.js
```

Dentro de este archivo se encuentra la configuración `COMIDAS`.

### Agregar una nueva sede

Para incorporar una sede:

1. Agregar una entrada en `SEDES`, dentro de `js/data/portal.js`.
2. Definir su `slug`, información Wi-Fi y teléfono.
3. Si tiene videos propios, configurar el campo `sedes: ['sX']` en los videos correspondientes.
4. Generar el QR con la URL de la sede.

No es necesario duplicar las pantallas ni crear una implementación independiente.

### Agregar un nuevo video

Incorporar una entrada en `VIDEOS`, dentro de `js/data/videos.js`.

Por convención, los archivos utilizan la siguiente nomenclatura:

```text
assets/videos/video-NN.mp4
assets/posters/video-NN.jpg
```

También se admiten videos externos de YouTube mediante `yt: 'ID'` y subtítulos mediante `subs: 'ruta.vtt'`.

### Agregar una nueva sección

Para incorporar una sección:

1. Agregar su entrada en `ITEMS`.
2. Implementar su renderizador en `DETALLE_VISTAS`, dentro de `js/features/detalle.js`.
3. Si la sección pertenece únicamente a determinadas sedes, especificarlas mediante `sedes: [...]`.

Las pruebas de integridad verifican que cada sección tenga su correspondiente pantalla.

### Configurar servicios adicionales

Los enlaces de los servicios Mary Kay se administran desde:

```text
SERVICIOS.marykay
```

Si alguno de los enlaces está vacío, el portal muestra el mensaje «Enlace pendiente».

### Configurar el modo de publicación

En `js/config.js` se encuentra la propiedad:

```js
CONFIG.modoPrueba = false;
```

Al desactivar el modo de prueba, se oculta la nota de selección temporal que se utiliza durante las pruebas y la configuración inicial de las sedes.

## Identificación de sede y códigos QR

La identificación de la sede se centraliza en la función:

```js
fijarSede(id, origen)
```

Esta función se encuentra en `js/core/router.js`.

Actualmente, el portal permite identificar la sede mediante:

- Selección manual.
- Parámetro de URL.
- Sede guardada previamente en el navegador.

Los parámetros admitidos son:

| Sede | Parámetro |
|---|---|
| Galery | `galery` |
| Galerías | `galerias` |
| Corferias | `corferias` |

Ejemplo de URL:

```text
index.html?sede=galery
```

Cuando se implementen los códigos QR físicos, cada uno deberá apuntar a la URL correspondiente con su parámetro `sede`.

Los valores desconocidos se ignoran y el portal muestra el selector de sede.

## Decisiones de arquitectura

Las decisiones técnicas buscan mantener el portal sencillo de desplegar, fácil de mantener y adecuado para su uso desde dispositivos móviles.

### 1. Sitio estático sin frameworks

Se utiliza HTML, CSS y JavaScript nativo, sin frameworks ni procesos de compilación.

Esta decisión responde al tamaño del proyecto, su uso mediante códigos QR y la necesidad de facilitar su mantenimiento por parte de un equipo reducido.

Además, permite publicar el portal en cualquier servicio de hosting estático, sin administrar un backend ni mantener dependencias de ejecución.

Si en el futuro se incorporan funcionalidades complejas, como cuentas de usuario, reservas o gestión de información en servidor, podría evaluarse una migración a un framework.

### 2. Separación de datos y lógica

El contenido que cambia con frecuencia se encuentra en `js/data/`.

Esto permite modificar sedes, servicios, videos y textos sin tener que alterar la lógica de las funcionalidades.

Las sedes comparten las mismas pantallas y se diferencian mediante sus datos de configuración.

### 3. Delegación centralizada de eventos

El proyecto evita el uso de atributos `onclick` en el HTML generado.

En su lugar, utiliza atributos `data-act="nombre"` y un sistema centralizado de acciones.

Los helpers `da()` y `daEvento()` se encuentran en `js/core/utils.js`, mientras que el despachador está en `js/core/acciones.js`.

Las acciones se registran en `ACCIONES` y se ejecutan mediante un único oyente por tipo de evento.

Para agregar una acción nueva, se registra en `ACCIONES` y se utiliza desde el HTML mediante `da('nombre', arg)`.

### 4. Política de seguridad de contenido (CSP)

El archivo `index.html` contiene una política CSP mediante una etiqueta `meta`.

La directiva `script-src 'self'` restringe la carga de scripts a los recursos del propio sitio y evita el uso de scripts en línea.

Los estilos en línea continúan permitidos porque se utilizan para definir anchos de barras y tamaños puntuales.

Si se incorpora un servicio externo, como una herramienta de analítica o un CDN adicional, será necesario revisar y actualizar la política CSP.

### 5. Validación de contenido dinámico

Las plantillas HTML utilizan información procedente de los archivos del repositorio.

La única entrada externa contemplada actualmente es el parámetro `?sede=`, que se valida contra las sedes disponibles antes de utilizarse.

Si en el futuro se incorpora contenido escrito por usuarios, deberá escaparse mediante `esc()` antes de insertarlo en el HTML.

### 6. Manejo de hora y almacenamiento

**Hora de Colombia:** las funcionalidades de alimentación y transporte utilizan `bogota()` para trabajar con la hora de Bogotá y evitar diferencias con la configuración horaria del dispositivo.

**Almacenamiento local:** el helper `almacen` administra las preferencias de sede, videos vistos y opciones de accesibilidad mediante `localStorage`.

Si el navegador bloquea el almacenamiento, el sistema falla de forma silenciosa para evitar interrumpir la navegación.

## Estado actual del contenido

La siguiente tabla identifica qué información está configurada y qué elementos dependen de información pendiente del cliente.

| Elemento | Estado |
|---|---|
| Sedes, direcciones y teléfonos | Configurado con información real. |
| Reglas, transporte y alimentación | Configurado con información real. |
| Emergencias | Configurado con información real. |
| Wi-Fi de Galery | Configurado, incluye código QR. |
| Wi-Fi de Galerías | Pendiente de información del cliente. |
| Wi-Fi de Corferias | Pendiente de información del cliente. |
| Mapa de evacuación | Disponible únicamente para Galery. |
| Servicios adicionales Mary Kay | Disponibles únicamente para Galery. |
| Enlaces de catálogo y escaneo de piel | Configurados para Galery. |
| Documentación normativa | Disponible en `Documentación normativa/`. |

**Consideración sobre el mapa:** el plano de evacuación de Galery está basado en el plano oficial, pero su representación dentro del portal es esquemática y no está a escala.

## Calidad, pruebas y accesibilidad

La calidad del código y la integridad del contenido se verifican mediante herramientas y pruebas automatizadas.

### Validaciones incluidas

- **ESLint:** identifica problemas y posibles errores en JavaScript.
- **Stylelint:** valida la estructura y consistencia del CSS.
- **Prettier:** mantiene un formato uniforme en los archivos.
- **Pruebas unitarias:** verifican la lógica y la integridad de los datos.
- **Pruebas E2E:** comprueban los flujos de navegación e interacción.
- **axe-core:** evalúa criterios automatizables de accesibilidad WCAG AA.

Las pruebas de integridad verifican, entre otros aspectos:

- Existencia de videos, portadas, íconos y códigos QR referenciados.
- Ausencia de identificadores duplicados.
- Correspondencia entre las secciones y sus pantallas.
- Funcionamiento de los flujos principales.

### Recomendaciones para mantener la accesibilidad

- No desactivar las pruebas de accesibilidad cuando aparezcan errores de contraste.
- Ajustar los colores para cumplir los criterios WCAG AA.
- Revisar manualmente los textos sobre imágenes y videos, ya que no todos los problemas visuales pueden detectarse automáticamente.
- Probar las funcionalidades en dispositivos móviles reales.

### Revisión de recursos multimedia

El archivo `assets/logo_vitae.png` corresponde a una versión optimizada de 400 píxeles y con paleta reducida.

El archivo original se conserva en:

```text
assets/originales/
```

También se recomienda revisar manualmente el reproductor de video en un celular real, especialmente el comportamiento del autoplay y la pantalla completa, ya que puede variar según el navegador.

## Consideraciones para publicación

Antes de publicar una nueva versión:

1. Revisar los cambios en el contenido y los recursos.
2. Ejecutar `npm run verificar`.
3. Comprobar que no existan errores en las pruebas.
4. Probar la navegación y los videos desde un dispositivo móvil.
5. Confirmar que los datos pendientes del cliente estén correctamente identificados.
6. Desactivar el modo de prueba cuando los códigos QR estén listos para producción.

## Seguridad y configuración

El portal no utiliza backend, variables de entorno ni credenciales privadas.

La clave de Wi-Fi se considera información pública para los huéspedes y forma parte del contenido informativo del portal.

La política CSP y las validaciones de entrada ayudan a mantener controlados los recursos y datos que utiliza la aplicación.

---

**Hotel Vitae — Portal del Huésped**

Sitio web estático diseñado para facilitar el acceso a información y servicios del hotel desde cualquier dispositivo.
