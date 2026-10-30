/** Pantalla de inicio: bienvenida, accesos a las secciones y videos para empezar. */

function avisoHTML() {
  const a = AVISOS.find((x) => !x.sedes || x.sedes.includes(currentSede));
  if (!a) return '';
  return `<button class="aviso" ${da('openDetail', a.destino)}><span>${a.texto}</span><b>${a.cta} ${ARW_R}</b></button>`;
}

/** Portada: texto de bienvenida, datos de la sede y el video de bienvenida (si existe). */
function heroHTML(sede, bienvenida) {
  const playBtn = bienvenida
    ? `<button class="btn-primary" ${da('openVideo', 'v1')}><span class="ic">${PLAY_I}</span> Ver video de bienvenida</button>`
    : '';
  const media = bienvenida
    ? `<button class="hero-media vthumb" ${da('openVideo', 'v1')} aria-label="Reproducir: ${bienvenida.title}">
        ${thumbHTML(bienvenida)}<span class="vplay">${PLAY_I}</span><span class="vtags"><span class="vdur" data-dur="v1">${bienvenida.dur || ''}</span></span>
      </button>`
    : '';
  return `<section class="hero">
      <div class="hero-text">
        <span class="badge">Sede ${sede.nombre}</span>
        <h1>Bienvenido a Hotel Vitae</h1>
        <p>${GLOBAL.esencia.bienvenida}</p>
        <ul class="hero-meta">
          <li>${PIN_I}<span>${sede.direccion}</span></li>
          <li>${CLOCK_I}<span>${GLOBAL.atencion}</span></li>
        </ul>
        ${playBtn}
      </div>
      ${media}
    </section>`;
}

/** Tarjeta «Ahora / Siguiente» del comedor. */
const comidaAhoraHTML = () =>
  `<button class="now" ${da('openDetail', 'horarios')} aria-label="Ver horarios de alimentación"><span class="live-meal">${liveMealHTML()}</span>${ARW_R}</button>`;

/** Cuadrícula «¿Qué necesitas?»: las secciones visibles en la sede, más la guía del huésped. */
function serviciosHTML() {
  const servicios = ITEMS.filter((i) => !['videos', 'guia'].includes(i.id) && !i.oculto && (!i.sedes || i.sedes.includes(currentSede)));
  const tarjeta = (it) =>
    `<button class="card" ${da('openDetail', it.id)}><span class="ic"><img src="${it.ic}" alt=""></span><b>${it.title}</b><small>${it.sub}</small></button>`;
  const guia = `<button class="card card-alt" ${da('openDetail', 'guia')}><span class="ic"><img src="assets/icons/guide.png" alt=""></span><b>Guía del huésped</b><small>Nuestra esencia y tus derechos</small></button>`;
  return `<section class="block">
      <div class="sec-head"><h2>¿Qué necesitas?</h2></div>
      <div class="grid">${servicios.map(tarjeta).join('')}${guia}</div>
    </section>`;
}

/** «Para empezar»: los videos destacados (el de bienvenida ya es el de la portada). */
function empezarHTML() {
  const L = vlist();
  const destacados = L.filter((v) => v.inicio && v.id !== 'v1').slice(0, 3);
  return `<section class="block">
      <div class="sec-head row"><div><h2>Para empezar</h2><p>Los videos que más ayudan en las primeras horas.</p>${progresoHTML()}</div>
        <a class="more" href="#d-videos" ${da('go', 'd-videos')}>Ver los ${L.length} videos ${ARW_R}</a></div>
      <div class="vgrid rail">${destacados.map((v) => videoCardHTML(v)).join('')}</div>
    </section>`;
}

function showHome() {
  $('homeContent').innerHTML =
    heroHTML(SEDES[currentSede], vById('v1')) + avisoHTML() + comidaAhoraHTML() + serviciosHTML() + empezarHTML();
  showPanel('home', 'inicio');
  pushNav('inicio');
}
