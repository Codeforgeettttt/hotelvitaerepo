/**
 * Biblioteca y reproductor de videos.
 * Estado: vWatched (ids vistos, se recuerdan en el dispositivo), vFiltro (categoría activa) y vActual (video abierto).
 */
const vWatched = new Set(almacen.leer(CLAVES.vistos, []));
const saveSeen = () => almacen.guardar(CLAVES.vistos, [...vWatched]);
let vFiltro = 'todos'; // filtro activo en la biblioteca
let vActual = null; // video abierto en el reproductor

const progresoHTML = () => {
  const L = vlist(),
    n = L.filter((v) => vWatched.has(v.id)).length;
  return `<div class="prog" aria-label="Videos vistos: ${n} de ${L.length}"><span>${n} de ${L.length} vistos</span><i><u style="width:${L.length ? Math.round((n / L.length) * 100) : 0}%"></u></i></div>`;
};
const vlist = () => VIDEOS.filter((v) => !v.sedes || v.sedes.includes(currentSede));
const vById = (id) => VIDEOS.find((v) => v.id === id);
const catOf = (id) => CATEGORIAS.find((c) => c.id === id);

function setDur(id, secs) {
  const v = vById(id);
  if (!v || !isFinite(secs) || secs <= 0) return;
  v.dur = fmtDur(secs);
  document.querySelectorAll('[data-dur="' + id + '"]').forEach((e) => (e.textContent = v.dur));
}
function mediaHTML(v) {
  if (v.yt)
    return `<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0" title="${v.title}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>`;
  if (v.mp4)
    return `<div class="vframe"><video controls autoplay playsinline preload="auto" poster="${v.poster || ''}" src="${v.mp4}" ${daEvento('error', 'videoFail')}>${v.subs ? `<track kind="subtitles" srclang="es" label="Español" src="${v.subs}" default>` : ''}</video></div>`;
  return '';
}
function videoFail(el) {
  el.parentElement.innerHTML =
    '<div class="vfail"><b>No se pudo cargar el video</b><small>Verifica que el archivo exista en assets/videos/</small></div>';
}

// miniatura: portada definida > miniatura de YouTube > primer cuadro del propio archivo > logo
function thumbHTML(v) {
  const img = v.poster || (v.yt ? `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg` : '');
  if (img)
    return `<img class="vlogo" src="${LOGO}" alt=""><img class="vimg" src="${img}" alt="" loading="lazy" decoding="async" ${daEvento('error', 'quitar')}>`;
  const frame = v.mp4
    ? `<video class="vimg" src="${v.mp4}#t=0.6" preload="metadata" muted playsinline tabindex="-1" ${daEvento('meta', 'setDur', v.id)} ${daEvento('error', 'quitar')}></video>`
    : '';
  return `<img class="vlogo" src="${LOGO}" alt="">${frame}`;
}

function videoCardHTML(v, opts = {}) {
  const c = catOf(v.cat);
  return `<button class="vcard${vWatched.has(v.id) ? ' seen' : ''}" data-vid="${v.id}" ${da('openVideo', v.id)} aria-label="Ver video: ${v.title}">
    <span class="vthumb">${thumbHTML(v)}
      <span class="vplay">${PLAY_I}</span>
      <span class="vtags"><span class="vdur" data-dur="${v.id}">${v.dur || ''}</span><span class="vseen">✓ Visto</span></span>
    </span>
    <span class="vinfo">
      ${opts.cat === false || !c ? '' : `<small>${c.titulo}</small>`}
      <b>${v.title}</b>
      <span class="vdesc">${v.desc}</span>
    </span>
  </button>`;
}

// ---- reproductor (diálogo nativo: Esc cierra, el foco queda atrapado, accesible) ----
function openVideo(id) {
  const v = vById(id);
  if (!v) return;
  const L = vlist(),
    i = L.indexOf(v);
  vActual = id;
  const c = catOf(v.cat);
  $('vmCat').textContent = c ? c.titulo : 'Video';
  $('vmMedia').innerHTML = mediaHTML(v);
  $('vmTitle').textContent = v.title;
  $('vmDesc').textContent = v.desc;
  $('vmCount').textContent = `${pad2(i + 1)} / ${pad2(L.length)}`;
  $('vmPrev').disabled = i === 0;
  $('vmNext').disabled = i === L.length - 1;
  const sec = (v.secciones || []).map((s) => ITEMS.find((x) => x.id === s)).filter(Boolean)[0];
  $('vmLink').innerHTML = sec ? `<button class="btn-ghost" ${da('leerMas', sec.id)}>Leer más: ${sec.title} ${ARW_R}</button>` : '';
  vWatched.add(id);
  saveSeen();
  const d = $('vmodal');
  if (!d.open) d.showModal();
  refreshSeen();
}
function stepModal(dir) {
  const L = vlist(),
    i = L.findIndex((v) => v.id === vActual) + dir;
  if (i >= 0 && i < L.length) openVideo(L[i].id);
}
function closeVideo() {
  const d = $('vmodal');
  if (d.open) d.close();
}
function refreshSeen() {
  document.querySelectorAll('.vcard[data-vid]').forEach((b) => b.classList.toggle('seen', vWatched.has(b.dataset.vid)));
}

// ---- biblioteca de videos ----
/** Chips de filtro por categoría (con el total de videos de cada una). */
function chipsCategoriasHTML(L, cats) {
  const chip = (id, texto, n) =>
    `<button class="chip" aria-pressed="${vFiltro === id}" ${da('setFiltro', id)}>${texto} <i>${n}</i></button>`;
  return `<div class="chips" role="group" aria-label="Filtrar videos por tema">${chip('todos', 'Todos', L.length)}${cats
    .map((c) => chip(c.id, c.titulo, L.filter((v) => v.cat === c.id).length))
    .join('')}</div>`;
}

/** Una categoría con su cuadrícula de videos. */
const categoriaVideosHTML = (c, L) => `<section class="vsec">
      <div class="sec-head"><h2>${c.titulo}</h2><p>${c.sub}</p></div>
      <div class="vgrid">${L.filter((v) => v.cat === c.id)
        .map((v) => videoCardHTML(v, { cat: false }))
        .join('')}</div>
    </section>`;

function showVideos() {
  const L = vlist();
  const cats = CATEGORIAS.filter((c) => L.some((v) => v.cat === c.id));
  const visibles = vFiltro === 'todos' ? cats : cats.filter((c) => c.id === vFiltro);
  $('videosContent').innerHTML = `
    <a class="back" href="#inicio" ${da('go', 'inicio')}>← Inicio</a>
    <div class="page-head">
      <h1>Videos de tu estadía</h1>
      <p>${L.length} videos cortos para conocer el hotel. Toca el que necesites.</p>
      ${progresoHTML()}
    </div>
    ${chipsCategoriasHTML(L, cats)}
    ${visibles.map((c) => categoriaVideosHTML(c, L)).join('')}`;
  showPanel('videos', 'd-videos');
  pushNav('d-videos');
}
function setFiltro(f) {
  vFiltro = f;
  const y = window.scrollY;
  showVideos();
  window.scrollTo(0, y);
}

// ---- videos dentro de cada sección de detalle ----
function sectionVideosHTML(secId) {
  const all = vlist();
  const L = all.filter((v) => (v.secciones || []).includes(secId));
  if (!L.length) return '';
  const btns = L.map(
    (v) => `<button class="svbtn" ${da('openVideo', v.id)} aria-label="Ver video: ${v.title}">
        <span class="svplay">${PLAY_I}</span>
        <span class="svtxt"><small>Video ${pad2(all.indexOf(v) + 1)} · ${v.dur || ''}</small><b>${v.title}</b></span>
        <span class="svgo">Ver</span>
      </button>`
  ).join('');
  // varios videos: se pliegan en un solo bloque para no empujar el contenido interactivo
  if (L.length > 1)
    return `<details class="svdet"><summary><span class="svplay">${PLAY_I}</span>${L.length} videos de esta sección</summary><div class="svids">${btns}</div></details>`;
  return `<div class="svids"><span class="svhead">Video de esta sección</span>${btns}</div>`;
}
