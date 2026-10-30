/**
 * Pantallas de detalle de cada sección (Wifi, Llave, Reglas, ...).
 * Cada sección es un renderizador en DETALLE_VISTAS que recibe la sede y devuelve HTML;
 * DETALLE_INICIO deja en su estado inicial las partes interactivas. Para una sección nueva:
 * agrégala en ITEMS (data/portal.js), escribe su renderizador aquí y, si tiene botones,
 * sus acciones en js/core/acciones.js.
 */
const detalleHead = (ic, title, tg) =>
  `<h1 class="d-title"><img class="h2-ic" src="${ic}" alt=""> ${title}</h1>${tg ? `<span class="tag">${tg}</span>` : ''}`;

/** Grupo de pestañas: items = [[clave, texto], ...]; la primera arranca activa. */
const pestanasHTML = (items, accion, extra = '') =>
  `<div class="seg${extra}" role="group"${extra ? ' aria-label="Filtrar reglas"' : ''}>${items
    .map(([k, t], i) => `<button aria-pressed="${i === 0}" ${da(accion, k)}>${t}</button>`)
    .join('')}</div>`;

const botonCopiar = (valor, clase) => `<button class="${clase}" data-copy="${esc(valor)}" ${da('copyText')}>Copiar</button>`;

// ---------------------------------------------------------------------
//  Bloques reutilizables de cada pantalla
// ---------------------------------------------------------------------
function wifiHTML(wifi) {
  if (!wifi.real) {
    return `<div class="box"><p class="empty">La red y la contraseña de esta sede aún no están publicadas. Pregúntalas en recepción.</p></div>`;
  }
  const qr = wifi.qr
    ? `<div class="wifi-qr"><img src="${wifi.qr}" alt="Código QR para conectarte al wifi ${wifi.red}"><small>Escanea con la cámara de tu celular</small></div>`
    : '';
  const fila = (rotulo, valor) => `<div class="wifi-row"><small>${rotulo}</small><b>${valor}</b>${botonCopiar(valor, 'copybtn')}</div>`;
  return `${qr}<div class="wifi-card">${fila('Red', wifi.red)}${fila('Contraseña', wifi.clave)}</div>`;
}

const REGLAS_FILTROS = [
  ['todos', 'Todas'],
  ['no', 'No se puede'],
  ['cond', 'Con condición'],
  ['info', 'Bueno saber']
];
const REGLAS_TEXTO_COMPLETO = [
  ['Normas generales', 'normas'],
  ['Convivencia', 'convivencia'],
  ['Instalaciones', 'instalaciones'],
  ['Sustancias y servicios', 'sustancias'],
  ['Seguridad', 'seguridad']
];

/** Chips de información rápida de Traslados. */
const TRASLADOS_CHIPS = `<div class="chips-info"><span>⏱ Espera máx. 10 min en el punto</span><span>🚐 Espera del vehículo: hasta 2 h</span><span>♿ Sillas o camillas: pídelas a tu EPS</span></div>`;

/** Calculadora de ruta: tipo de viaje, fecha y hora. El resultado lo pinta trCalc(). */
function plannerTrasladosHTML() {
  const manana = new Date(bogota().getTime() + 86400000);
  return `<div class="box planner">
      <b class="box-t">Calcula tu ruta</b>
      ${pestanasHTML(
        [
          ['cita', 'Cita médica'],
          ['aero', 'Aeropuerto']
        ],
        'setTrKind'
      )}
      <div class="fields"><label>Fecha<input type="date" id="trDate" value="${isoDate(manana)}" min="${isoDate(bogota())}" ${daEvento('change', 'trCalc')}></label>
        <label>Hora<input type="time" id="trTime" value="14:00" ${daEvento('change', 'trCalc')}></label></div>
      <div id="trOut" aria-live="polite"></div>
    </div>`;
}

/** Teléfonos de emergencia: el principal, la tarjeta del mapa (si la sede lo tiene) y los demás. */
function telefonosEmergenciaHTML() {
  const E = GLOBAL.emergencias,
    principal = E.telefonos[0],
    otros = E.telefonos.slice(1).filter((t) => t[1] !== '123');
  const mapa = mapaDisponible()
    ? `<button class="mapcard" ${da('openDetail', 'mapa')}><span class="mapcard-e" aria-hidden="true">🗺️</span><span><b>Mapa de evacuación</b><small>Toca tu habitación y ve tu ruta de salida</small></span>${ARW_R}</button>`
    : '';
  const dial = (t, clase = 'dial') => `<a class="${clase}" href="${telHref(t[1])}"><span>${t[0]}</span><b>${t[1]}</b></a>`;
  return `<a class="sos-big" href="${telHref('123')}"><span>Llamar a emergencias</span><b>123</b></a>
      ${dial(principal, 'dial dial-main')}
      ${mapa}
      <div class="dials">${otros.map((t) => dial(t)).join('')}</div>`;
}

/** Ficha de contacto: título, valor y botones de acción. */
const contactoFichaHTML = (titulo, valor, botones) =>
  `<div class="ctile"><div class="ctop"><b>${titulo}</b><span>${valor}</span></div><div class="cbtns">${botones}</div></div>`;

const botonesContacto = (tel, mensaje) =>
  `<a class="cta cta-sm" href="${waLink(tel, mensaje)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn-ghost" href="${telHref(tel)}">Llamar</a>${botonCopiar(tel, 'btn-ghost')}`;

/** Botón de enlace externo, o aviso si aún no se ha cargado el enlace. */
const enlaceServicioHTML = (url, texto) =>
  url ? `<a class="cta cta-sm" href="${url}" target="_blank" rel="noopener">${texto}</a>` : `<span class="pend">Enlace pendiente</span>`;

// ---------------------------------------------------------------------
//  Una pantalla por sección
// ---------------------------------------------------------------------
const DETALLE_VISTAS = {
  wifi: (s) => detalleHead('assets/icons/wifi.png', 'Wifi', 'Sede ' + s.nombre) + wifiHTML(s.wifi),

  llave(s) {
    const titulos = ['Al llegar', 'Al salir', 'Si la pierdes'],
      emojis = ['🔑', '🏨', '🛎️'];
    const tarjetas = GLOBAL.llave
      .map(
        (t, i) => `<div class="mini big"><span class="mini-e">${emojis[i] || ''}</span><span><b>${titulos[i] || ''}</b>${t}</span></div>`
      )
      .join('');
    return (
      detalleHead('assets/icons/check-in.png', 'Check-in / Llave', 'Todas las sedes') +
      `<div class="cards2 one">${tarjetas}</div><a class="cta cta-block" href="${telHref(s.contacto.tel)}">Avisar a recepción</a>`
    );
  },

  reglas() {
    const R = GLOBAL.reglas;
    const textoCompleto = REGLAS_TEXTO_COMPLETO.map(([titulo, clave]) => `<h3 class="mini-h">${titulo}</h3>${ul(R[clave])}`).join('');
    return (
      detalleHead('assets/icons/reglas.png', 'Reglas: ¿se puede…?', 'Todas las sedes') +
      `<div class="finder"><input type="search" id="rqSearch" placeholder="Busca: mascotas, visitas, ruido…" ${daEvento('input', 'buscarRQ')} aria-label="Buscar una regla"></div>
       ${pestanasHTML(REGLAS_FILTROS, 'setRQ', ' seg-wrap')}
       <div id="rqList"></div>
       <div class="sep"></div>` +
      acc('Texto completo de derechos y deberes', textoCompleto)
    );
  },

  traslados() {
    const T = GLOBAL.transporte;
    return (
      detalleHead('assets/icons/car.png', 'Traslados', 'Todas las sedes') +
      `<div class="facts"><span><b>1 día</b>de anticipación</span><span><b>7 a.m.–5 p.m.</b>para solicitar</span><span><b>Colectivo</b>se comparte</span></div>
       ${plannerTrasladosHTML()}
       <a class="cta cta-block" href="${waLink(GLOBAL.tel_ruta, 'Hola, quiero agendar mi ruta de transporte')}" target="_blank" rel="noopener">Agendar por WhatsApp</a>
       ${TRASLADOS_CHIPS}` +
      acc('Todas las reglas del transporte', `<p class="lead">${T.intro}</p>${ul(T.reglas)}`)
    );
  },

  horarios: () =>
    detalleHead('assets/icons/comida.png', 'Alimentación', 'Todas las sedes') +
    `<div class="now live-box" id="mealLive" aria-live="polite"></div>
       <div id="mealList"></div>
       <button class="setfest" aria-pressed="${fest}" ${da('toggleFest')}><span class="sw"></span>Hoy es domingo o festivo</button>`,

  emergencias: () =>
    detalleHead('assets/icons/emergency.png', 'Emergencias', 'Todas las sedes') +
    telefonosEmergenciaHTML() +
    `<div class="sep"></div>
       <h2 class="h-sm">¿Qué hago?</h2>
       ${pestanasHTML(
         [
           ['sismos', 'Sismo'],
           ['incendios', 'Incendio'],
           ['evacuar', 'Al evacuar']
         ],
         'setEm'
       )}
       <p class="hint">Toca cada paso para marcarlo.</p>
       <div id="emSteps" class="steps"></div>`,

  contacto(s) {
    const correo = `<a class="cta cta-sm" href="mailto:${GLOBAL.correo_pqrf}?subject=${encodeURIComponent('PQRF Hotel Vitae - ' + s.nombre)}">Escribir</a>${botonCopiar(GLOBAL.correo_pqrf, 'btn-ghost')}`;
    return (
      detalleHead('assets/icons/contact-us.png', 'Contacto', 'Todas las sedes') +
      contactoFichaHTML(
        'Ruta / transporte',
        GLOBAL.tel_ruta,
        botonesContacto(GLOBAL.tel_ruta, 'Hola, quiero agendar mi ruta de transporte')
      ) +
      contactoFichaHTML('Reservas', GLOBAL.tel_reservas, botonesContacto(GLOBAL.tel_reservas, 'Hola, quiero información sobre reservas')) +
      contactoFichaHTML('PQRF · quejas, reclamos y sugerencias', GLOBAL.correo_pqrf, correo)
    );
  },

  mapa: (s) =>
    detalleHead('assets/icons/emergency.png', 'Mapa de evacuación', 'Sede ' + s.nombre) +
    `<p class="hint" style="margin:0 0 12px">Plano esquemático del primer piso, no está a escala.</p><div id="mapaApp"></div>`,

  servicios(s) {
    const M = SERVICIOS.marykay;
    return (
      detalleHead('assets/icons/servicios.svg', 'Servicios adicionales', 'Sede ' + s.nombre) +
      `<div class="svc"><span class="svc-e" aria-hidden="true">💄</span><div><b>Catálogo Mary Kay</b><small>Conoce los productos y pide el que te guste.</small>${enlaceServicioHTML(M.catalogo, 'Ver catálogo')}</div></div>
       <div class="svc"><span class="svc-e" aria-hidden="true">✨</span><div><b>Escaneo de piel</b><small>Servicio Mary Kay.</small>${enlaceServicioHTML(M.escaneo, 'Hacer el escaneo')}</div></div>
       <div class="box svc-note"><b class="box-t">¿Cómo compro?</b><p class="lead">Las ventas están a cargo de ${M.vendedora}. Pregunta en recepción.</p></div>`
    );
  },

  guia: (s) =>
    detalleHead('assets/icons/guide.png', 'Guía del huésped', 'Sede ' + s.nombre) +
    pestanasHTML(
      [
        ['esencia', 'Nuestra esencia'],
        ['derechos', 'Tus derechos'],
        ['deberes', 'Tus deberes']
      ],
      'setGuia'
    ) +
    `<div id="guiaBody"></div>`
};

/** Estado inicial de las partes interactivas de cada sección (se ejecuta tras pintar el HTML). */
const DETALLE_INICIO = {
  horarios() {
    fest = bogota().getDay() === 0;
    renderMeals();
  },
  traslados: () => trCalc(),
  reglas: () => renderRQ(),
  emergencias: () => renderEm(),
  guia: () => renderGuia(),
  mapa() {
    reiniciarMapa();
    renderMapa();
  }
};

/** Pestaña del menú fijo que se resalta para cada sección. */
const DETALLE_NAV = { guia: 'd-guia', contacto: 'd-contacto' };

/**
 * Inserta los videos de la sección: en Emergencias van al final; en las demás, justo bajo el título.
 * @param {string} id Sección.
 * @param {string} html HTML de la pantalla.
 */
function conVideosDeSeccion(id, html) {
  const sv = sectionVideosHTML(id);
  if (!sv) return html;
  if (id === 'emergencias') return html + '<div class="sep"></div>' + sv;
  return html.replace(/^(<h1[\s\S]*?<\/h1>(?:<span class="tag">[\s\S]*?<\/span>)?)/, (m) => m + sv);
}

/** Vuelve las pestañas de todas las secciones a su opción inicial. */
function reiniciarEstadoDetalle() {
  trKind = 'cita';
  rqFiltro = 'todos';
  rqBusca = '';
  emTab = 'sismos';
  guiaTab = 'esencia';
}

function openDetail(id) {
  if (id === 'videos') return go('d-videos');
  const it = ITEMS.find((x) => x.id === id);
  if (!it || (it.sedes && !it.sedes.includes(currentSede))) return showHome();
  const volver = `<a class="back" href="#inicio" ${da('go', 'inicio')}>← Inicio</a>`;
  $('detailContent').innerHTML = volver + conVideosDeSeccion(id, DETALLE_VISTAS[id](SEDES[currentSede]));
  reiniciarEstadoDetalle();
  if (DETALLE_INICIO[id]) DETALLE_INICIO[id]();
  showPanel('detail', DETALLE_NAV[id] || null);
  pushNav('d-' + id);
}
