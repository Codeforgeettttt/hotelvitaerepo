/**
 * Mapa de evacuación (solo sedes con plano; hoy Galery). Esquemático, no está a escala.
 * Los datos del plano (habitaciones, puertas, salidas) están en data/mapa-galery.js;
 * aquí viven el cálculo de rutas, el dibujo SVG (en piezas pequeñas) y los controles.
 * Estado: mp = {room, exit, mode ('evac'|'sani'), zoom}.
 */
const mp = { room: null, exit: 'auto', mode: 'evac', zoom: false };

/** Deja el mapa en su estado inicial (sin habitación elegida). */
function reiniciarMapa() {
  Object.assign(mp, { room: null, exit: 'auto', mode: 'evac', zoom: false });
}

const mapaDisponible = () => ITEMS.find((i) => i.id === 'mapa').sedes.includes(currentSede);

// ---------------------------------------------------------------------
//  Rutas (lógica pura: se prueba sin navegador)
// ---------------------------------------------------------------------
function mapaRuta(room, ex) {
  const h = MAPA_HAB[room],
    [dx, dy] = h.d,
    e = MAPA_EXITS[ex].pt;
  const pts = [
    [dx, dy === C_Y ? C_Y : dy > C_Y ? dy + 40 : dy - 40],
    [dx, dy],
    [dx, C_Y]
  ];
  if (ex === 'o') {
    pts.push([190, C_Y], [e[0] + 15, e[1]]);
  } else if (ex === 'e') {
    pts.push([e[0] - 10, C_Y]);
  } else {
    pts.push([905, C_Y], [905, e[1]], [e[0] - 10, e[1]]);
  }
  // quitar puntos repetidos
  return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
}
function mapaExitAuto(room) {
  return MAPA_HAB[room].w;
}
function mapaPasos(room, ex) {
  const n = room === 'rec' ? 'la recepción' : 'la habitación ' + room;
  const out = ['Sal de ' + n + ' sin correr y deja la puerta sin seguro.'];
  if (ex === 'o')
    out.push('Gira hacia el lobby y sigue el pasillo hasta la recepción.', 'Sal por la Carrera 24 y ve al punto de encuentro.');
  if (ex === 'e') out.push('Sigue el pasillo hacia el este, hasta la salida de emergencia.', 'Ve al punto de encuentro.');
  if (ex === 's')
    out.push(
      'Sigue el pasillo hacia el este y sube por el pasillo vertical.',
      'Cruza la sala de estar, sal por la salida de emergencia y ve al punto de encuentro.'
    );
  out.push('Si hay humo, avanza gateando. No regreses por nada.');
  return out;
}
/** Salida que se está usando: ninguna sin habitación, la de Carrera 24 en modo sanitario, o la elegida / más cercana. */
function mapaSalidaActual() {
  if (!mp.room) return null;
  if (mp.mode === 'sani') return 'o';
  return mp.exit === 'auto' ? mapaExitAuto(mp.room) : mp.exit;
}

// ---------------------------------------------------------------------
//  Dibujo SVG (una función por capa del plano)
// ---------------------------------------------------------------------
const svgRect = (x1, y1, x2, y2, cls = 'm-deco') =>
  `<rect class="${cls}" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" stroke="var(--txt2)"/>`;

/** Pasillos, espacios decorativos (baños, bodegas, oficina), sus rótulos y el nombre de la calle. */
function mapaFondoSvg() {
  const pasillos = `<rect class="m-corr" x="160" y="580" width="285" height="140"/><rect class="m-corr" x="445" y="655" width="665" height="65"/><rect class="m-corr" x="835" y="175" width="135" height="545"/><rect class="m-corr" x="970" y="175" width="140" height="305"/>`;
  const espacios = [
    [160, 770, 445, 850],
    [835, 175, 970, 255],
    [970, 480, 1110, 655],
    [610, 530, 665, 655],
    [665, 530, 715, 655],
    [565, 720, 625, 850],
    [945, 720, 1000, 850],
    [835, 255, 905, 655]
  ]
    .map((r) => svgRect(...r))
    .join('');
  const rotulos = [
    [302, 815, 'Bodega'],
    [1040, 570, 'Oficina'],
    [1040, 300, 'Sala de estar'],
    [902, 225, 'Bodega'],
    [637, 600, 'WC'],
    [690, 600, 'WC'],
    [870, 400, 'WC'],
    [595, 790, 'WC'],
    [972, 790, 'WC'],
    [375, 650, 'Lobby']
  ]
    .map(([x, y, t]) => `<text class="m-s" x="${x}" y="${y}">${t}</text>`)
    .join('');
  return pasillos + espacios + rotulos;
}

/** Habitaciones y recepción: cada una es un botón (clic o Enter/Espacio) que elige "tu habitación". */
function mapaHabitacionesSvg() {
  const boton = (k) => {
    const [x1, y1, x2, y2] = MAPA_HAB[k].r,
      sel = mp.room === k;
    const etiqueta = k === 'rec' ? 'Recepción' : 'Habitación ' + k;
    return `<g class="m-btn${sel ? ' sel' : ''}" role="button" tabindex="0" aria-label="${etiqueta}" aria-pressed="${sel}" ${da('mapaPick', k)}><rect class="m-room" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/><text class="m-t" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 14}">${k === 'rec' ? '' : k}</text></g>`;
  };
  return (
    Object.keys(MAPA_HAB).map(boton).join('') +
    `<text class="m-sb" x="230" y="640" style="pointer-events:none">Recepción</text>` +
    `<text class="m-street" transform="translate(112 770) rotate(-90)">Carrera 24</text>`
  );
}

/** Salidas, puntos de encuentro (P.E.) y extintores; resalta los de la salida elegida. */
function mapaSalidasSvg(ex) {
  const hot = (k) => ex === k;
  const salida = (x, y, h) =>
    `<g class="m-exit${h ? ' hot' : ''}"><rect x="${x - 34}" y="${y - 14}" width="68" height="28" rx="5"/><text x="${x}" y="${y + 7}">SALIDA</text></g>`;
  const punto = (x, y, h) =>
    `<g class="m-pe${h ? ' hot' : ''}"><circle cx="${x}" cy="${y}" r="26"/><text x="${x}" y="${y + 7}">P.E.</text></g>`;
  const extintor = (x, y) =>
    `<g class="m-ext"><rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="6"/><path d="M${x - 5} ${y + 7}V${y - 4}l5-4 5 4v11"/></g>`;
  return (
    salida(1075, C_Y, hot('e')) +
    punto(MAPA_EXITS.e.pe[0], C_Y, hot('e')) +
    salida(1075, 375, hot('s')) +
    punto(MAPA_EXITS.s.pe[0], 375, hot('s')) +
    punto(90, 620, hot('o')) +
    [extintor(368, 607), extintor(975, 682), extintor(1050, 508), extintor(1088, 452)].join('')
  );
}

/** Solo en modo «Ruta sanitaria»: botiquín, camilla y shut de basura. */
function mapaSanitariaSvg() {
  return (
    `<g class="m-sani"><rect class="bq" x="196" y="602" width="34" height="26" rx="5"/><path d="M213 608v14M206 615h14"/><rect x="236" y="604" width="48" height="8" rx="4" fill="var(--no)"/><path d="M240 622h40" /><text x="232" y="566" class="m-s">Botiquín y camilla</text></g>` +
    `<g><rect x="1010" y="730" width="80" height="26" rx="4" fill="#1d6fb8"/><text class="m-s" x="1050" y="783">Shut basura</text></g>`
  );
}

/** Línea animada de la ruta y el muñeco que marca dónde está el huésped. */
function mapaRutaSvg(ex) {
  const pts = mapaRuta(mp.room, ex),
    d = 'M' + pts.map((p) => p.join(' ')).join('L');
  return (
    `<path class="m-route${mp.mode === 'sani' ? ' red' : ''}" d="${d}"/>` +
    `<g class="m-me" transform="translate(${pts[0][0]} ${pts[0][1]})"><circle r="17"/><circle r="6" cy="-5" fill="#fff"/><path d="M-8 9a8 8 0 0116 0z"/></g>`
  );
}

function mapaSvg() {
  const ex = mapaSalidaActual();
  return (
    `<svg class="map-svg" viewBox="60 160 1140 710" role="group" aria-label="Plano esquemático del primer piso, sede Galery. Las habitaciones son botones.">` +
    mapaFondoSvg() +
    mapaHabitacionesSvg() +
    mapaSalidasSvg(ex) +
    (mp.mode === 'sani' ? mapaSanitariaSvg() : '') +
    (mp.room ? mapaRutaSvg(ex) : '') +
    '</svg>'
  );
}

// ---------------------------------------------------------------------
//  Controles y pasos escritos
// ---------------------------------------------------------------------
function mapaPick(k) {
  mp.room = k;
  renderMapa();
}
function mapaSet(key, val) {
  mp[key] = val;
  renderMapa();
}

const mapaNombreHab = (k) => (k === 'rec' ? 'Recepción' : k);
const mapaBotones = (items, activo, accion) =>
  items.map(([k, t]) => `<button aria-pressed="${activo(k)}" ${accion(k)}>${t}</button>`).join('');

/** Cuadro con los pasos escritos (para quien no lee bien el plano). */
function mapaInfoHTML() {
  const R = mp.room;
  if (!R) {
    return `<div class="box map-hint"><b class="box-t">¿Dónde estás?</b><p class="lead">Toca tu habitación en el plano o en la lista y te mostramos tu ruta.</p></div>`;
  }
  if (mp.mode === 'sani') {
    return `<div class="box"><b class="box-t">Ruta sanitaria</b><ol class="rsteps"><li>Dirígete a la recepción por el pasillo.</li><li>Allí están el botiquín y la camilla.</li><li>Pide ayuda al personal y llama al 123 si es una emergencia.</li></ol></div>`;
  }
  const e = mapaSalidaActual();
  const origen = R === 'rec' ? 'Recepción' : 'Hab. ' + R;
  return `<div class="box"><b class="box-t">Tu ruta · ${origen} → ${MAPA_EXITS[e].nombre}</b><ol class="rsteps">${mapaPasos(R, e)
    .map((t) => `<li>${t}</li>`)
    .join('')}</ol></div>`;
}

const MAPA_SALIDAS = [
  ['auto', 'La más cercana'],
  ['o', 'Carrera 24'],
  ['e', 'Salida este'],
  ['s', 'Sala de estar']
];
const MAPA_LEYENDA = `<div class="legend"><span><i class="lg ex"></i>Salida</span><span><i class="lg pe"></i>Punto de encuentro</span><span><i class="lg ft"></i>Extintor</span><span><i class="lg" style="background:var(--p)"></i>Tu ruta</span></div>`;

function renderMapa() {
  const el = $('mapaApp');
  if (!el) return;
  const sani = mp.mode === 'sani';
  const modos = `<div class="seg" role="group">${mapaBotones(
    [
      ['evac', 'Evacuación'],
      ['sani', 'Ruta sanitaria']
    ],
    (k) => (k === 'sani') === sani,
    (k) => da('mapaSet', 'mode', k)
  )}</div>`;
  const habitaciones = `<div class="rchips" role="group" aria-label="Tu habitación">${mapaBotones(
    Object.keys(MAPA_HAB).map((k) => [k, mapaNombreHab(k)]),
    (k) => mp.room === k,
    (k) => da('mapaPick', k)
  )}</div>`;
  const salidas = sani
    ? ''
    : `<div class="rchips" role="group" aria-label="Salida">${mapaBotones(
        MAPA_SALIDAS,
        (k) => mp.exit === k,
        (k) => da('mapaSet', 'exit', k)
      )}</div>`;
  const plano = `<div class="map-wrap${mp.zoom ? ' zoom' : ''}"><button class="btn-ghost map-zoom" ${da('mapaSet', 'zoom', !mp.zoom)}>${mp.zoom ? 'Reducir' : 'Ampliar'}</button><div class="map-scroll">${mapaSvg()}</div></div>`;
  el.innerHTML = modos + habitaciones + salidas + plano + MAPA_LEYENDA + mapaInfoHTML();
}
