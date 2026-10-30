/**
 * Acciones de la interfaz y despachador de eventos.
 *
 * El HTML generado no usa atributos onclick/onchange/...: marca cada elemento con data-act="nombre"
 * (ver da() en utils.js) y un solo oyente por tipo de evento, registrado en document, ejecuta la
 * función correspondiente de ACCIONES. Así la página puede usar una política CSP sin 'unsafe-inline'
 * para scripts, y los eventos siguen funcionando aunque el contenido se vuelva a pintar.
 *
 * Cada acción recibe (elemento, ...argumentos de data-args, [valor del campo en input/change]).
 * Para una acción nueva: agrégala aquí y úsala en el HTML con da('nombre', arg1, arg2).
 */
const ACCIONES = {
  // navegación
  go: (_el, ruta) => go(ruta),
  openDetail: (_el, id) => openDetail(id),
  selectSede: (_el, id) => selectSede(id),
  changeSede: () => changeSede(),

  // videos
  openVideo: (_el, id) => openVideo(id),
  closeVideo: () => closeVideo(),
  stepModal: (_el, dir) => stepModal(dir),
  leerMas: (_el, id) => {
    closeVideo();
    openDetail(id);
  },
  setFiltro: (_el, f) => setFiltro(f),
  videoFail: (el) => videoFail(el),
  quitar: (el) => el.remove(),
  setDur: (el, id) => setDur(id, el.duration),

  // accesibilidad
  openA11y: () => openA11y(),
  closeA11y: () => $('a11yDlg').close(),
  setTexto: (_el, n) => setTexto(n),
  toggleA11y: (_el, k) => toggleA11y(k),
  resetA11y: () => resetA11y(),

  // secciones
  copyText: (el) => copyText(el),
  toggleFest: () => toggleFest(),
  setTrKind: (el, k) => setTrKind(k, el),
  trCalc: () => trCalc(),
  setRQ: (el, k) => setRQ(k, el),
  buscarRQ: (_el, valor) => buscarRQ(valor),
  setEm: (el, k) => setEm(k, el),
  setGuia: (el, k) => setGuia(k, el),
  toggleStep: (el) => el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true')),

  // mapa de evacuación
  mapaPick: (_el, k) => mapaPick(k),
  mapaSet: (_el, clave, valor) => mapaSet(clave, valor)
};

/** Argumentos de la acción (data-args es un arreglo JSON; si está dañado se ignora). */
function argsDe(el) {
  try {
    return JSON.parse(el.dataset.args || '[]');
  } catch (_e) {
    return [];
  }
}

/** Ejecuta la acción indicada en el atributo; avisa en consola si el nombre no existe (error de tipeo). */
function ejecutarAccion(el, atributo, extra = []) {
  const nombre = el.getAttribute(atributo);
  const fn = ACCIONES[nombre];
  if (!fn) {
    console.warn('Acción desconocida: ' + nombre);
    return;
  }
  fn(el, ...argsDe(el), ...extra);
}

/** Registra los oyentes globales. Se llama una sola vez desde main.js. */
function conectarEventos() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.tagName === 'A') e.preventDefault(); // los enlaces internos navegan con go(), no con el hash del navegador
    ejecutarAccion(el, 'data-act');
  });

  // Elementos no nativos con role="button" (las habitaciones del plano SVG): Enter y Espacio activan.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('[data-act][role="button"]');
    if (!el || el.tagName === 'BUTTON') return;
    e.preventDefault();
    ejecutarAccion(el, 'data-act');
  });

  // Campos: la acción recibe el valor actual.
  ['input', 'change'].forEach((tipo) =>
    document.addEventListener(tipo, (e) => {
      const el = e.target.closest('[data-act-' + tipo + ']');
      if (el) ejecutarAccion(el, 'data-act-' + tipo, [el.value]);
    })
  );

  // Eventos de medios: no burbujean, pero sí se pueden interceptar en la fase de captura.
  [
    ['error', 'data-act-error'],
    ['loadedmetadata', 'data-act-meta']
  ].forEach(([tipo, atributo]) =>
    document.addEventListener(
      tipo,
      (e) => {
        const el = e.target;
        if (el && el.hasAttribute && el.hasAttribute(atributo)) ejecutarAccion(el, atributo);
      },
      true
    )
  );
}
