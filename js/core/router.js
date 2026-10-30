/**
 * Identificación de sede y navegación (hash). Un único punto de entrada para la sede: fijarSede().
 */
let currentSede = null;

// =====================================================================
//  IDENTIFICACIÓN DE SEDE — un único punto de entrada
//  Hoy:    selección manual (selectSede) y, si existe, ?sede=<slug> en la URL.
//  Futuro: el QR de cada sede solo tiene que apuntar a  index.html?sede=galery
//          (o galerias / corferias). Ambos caminos terminan en fijarSede(),
//          así que el contenido y la navegación son exactamente los mismos.
// =====================================================================
const sedeIdPorSlug = (s) => Object.keys(SEDES).find((id) => SEDES[id].slug === s || id === s) || null;

function leerSedeDeURL() {
  try {
    const q = new URLSearchParams(location.search).get('sede');
    return q ? sedeIdPorSlug(q.toLowerCase().trim()) : null;
  } catch (_e) {
    return null;
  }
}
function leerSedeGuardada() {
  const g = almacen.leerTexto(CLAVES.sede);
  return SEDES[g] ? g : null;
}
function identificarSede() {
  const u = leerSedeDeURL();
  if (u) return { id: u, origen: 'url' };
  const g = leerSedeGuardada();
  if (g) return { id: g, origen: 'guardada' };
  return null;
}
function fijarSede(id, origen) {
  currentSede = id;
  almacen.guardarTexto(CLAVES.sede, id);
  renderChrome();
  return origen;
}

// ---- selector manual (temporal) ----
function buildSedeSelector() {
  $('sedeList').innerHTML = Object.entries(SEDES)
    .map(
      ([id, s]) =>
        `<button class="sede-btn" ${da('selectSede', id)}>
      <span class="sede-name"><b>${s.nombre}</b><span class="sede-go">${ARW_R}</span></span>
      <span class="sede-row">${PIN_I}<span>${s.direccion}</span></span>
      <span class="sede-row">${CLOCK_I}<span>${GLOBAL.atencion}</span></span>
    </button>`
    )
    .join('');
  $('sedeNote').hidden = !CONFIG.modoPrueba;
}
function selectSede(id) {
  // si el usuario cambia de sede a mano, la URL con ?sede= ya no debe imponerse al recargar
  reemplazarURL(location.pathname + '#sede', !!location.search);
  fijarSede(id, 'manual');
  go('inicio');
}
function changeSede() {
  go('sede');
}

// =====================================================================
//  NAVEGACIÓN (hash; el botón "atrás" del celular funciona entre pantallas)
// =====================================================================
let _fromPop = false;
/** Cambia la URL sin agregar una entrada al historial (puede fallar en file:// o iframes: no es crítico). */
function reemplazarURL(url, activo = true) {
  if (!activo) return;
  try {
    history.replaceState(null, '', url);
  } catch (_e) {
    /* la navegación sigue funcionando sin URL limpia */
  }
}
function pushNav(h) {
  if (_fromPop || location.hash.slice(1) === h) return;
  try {
    history.pushState(null, '', '#' + h);
  } catch (_e) {
    location.hash = h;
  }
}
function go(route) {
  if (route === 'sede') return showSelector();
  if (!currentSede) return showSelector();
  if (route === 'inicio') return showHome();
  if (route === 'd-videos') {
    vFiltro = 'todos';
    return showVideos();
  } // al entrar siempre se ven todos; el filtro solo vive mientras se está en la biblioteca
  if (route.startsWith('d-') && ITEMS.some((i) => i.id === route.slice(2))) return openDetail(route.slice(2));
  showHome();
}
function routeFromHash() {
  go(location.hash.slice(1) || 'inicio');
}
window.addEventListener('popstate', () => {
  _fromPop = true;
  try {
    routeFromHash();
  } finally {
    _fromPop = false;
  }
});

function showPanel(name, navKey) {
  ['selector', 'home', 'videos', 'detail'].forEach((p) => $('panel-' + p).classList.toggle('active', p === name));
  document.body.dataset.view = name;
  document.querySelectorAll('#mainNav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === navKey));
  window.scrollTo(0, 0);
}
function renderChrome() {
  const on = !!currentSede;
  $('sedeChip').hidden = !on;
  $('mainNav').hidden = !on;
  $('sosBtn').hidden = !on;
  if (on) $('sedeChipName').textContent = SEDES[currentSede].nombre;
}

function showSelector() {
  $('sedeNote').hidden = !CONFIG.modoPrueba;
  showPanel('selector', null);
  pushNav('sede');
}
/** Decide la pantalla inicial: sede por URL (QR), sede guardada o selector manual. */
function iniciarPortal() {
  const r = identificarSede();
  if (r) {
    fijarSede(r.id, r.origen);
    const h = location.hash.slice(1);
    // con sede por URL (QR) se entra siempre al inicio; con sede guardada se respeta el enlace interno
    reemplazarURL(location.pathname + location.search + '#inicio');
    _fromPop = true;
    try {
      go(r.origen === 'guardada' && h && h !== 'sede' ? h : 'inicio');
    } finally {
      _fromPop = false;
    }
  } else {
    renderChrome();
    reemplazarURL(location.pathname + location.search + '#sede');
    _fromPop = true;
    try {
      showSelector();
    } finally {
      _fromPop = false;
    }
  }
}
