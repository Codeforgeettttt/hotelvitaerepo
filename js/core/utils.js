/**
 * Utilidades compartidas: formato, hora de Colombia, almacenamiento seguro y
 * pequeños componentes HTML. No depende del contenido ni del estado del portal.
 */
const pad2 = (n) => String(n).padStart(2, '0');

const $ = (id) => document.getElementById(id);

const PLAY_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ARW_R =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
const PIN_I =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const CLOCK_I =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';

/** Segundos -> "m:ss". Redondea primero, así 59.6 s da "1:00" y nunca "0:60". */
const fmtDur = (t) => {
  const s = Math.round(t);
  return Math.floor(s / 60) + ':' + pad2(s % 60);
};

/** Escapa texto para insertarlo en HTML o en un atributo. */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Acceso seguro a localStorage. Puede fallar (modo privado, cuota llena, datos
 * corruptos); en ese caso el portal sigue funcionando, solo que sin recordar.
 */
const almacen = {
  leerTexto(clave) {
    try {
      return localStorage.getItem(clave);
    } catch (_e) {
      return null;
    }
  },
  guardarTexto(clave, valor) {
    try {
      localStorage.setItem(clave, valor);
    } catch (_e) {
      /* sin almacenamiento: se omite */
    }
  },
  leer(clave, defecto) {
    try {
      const v = localStorage.getItem(clave);
      return v === null ? defecto : JSON.parse(v);
    } catch (_e) {
      return defecto;
    }
  },
  guardar(clave, valor) {
    almacen.guardarTexto(clave, JSON.stringify(valor));
  }
};

const telHref = (t) => 'tel:' + String(t).replace(/[^\d+]/g, '');

function waLink(tel, texto) {
  return `https://wa.me/57${tel}?text=${encodeURIComponent(texto)}`;
}

const acc = (title, body, open) =>
  `<details class="acc"${open ? ' open' : ''}><summary>${title}</summary><div class="acc-body">${body}</div></details>`;

const ul = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join('')}</ul>`;

const CHECK_I =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/** Copia al portapapeles. El texto sale de data-copy (así no se rompe con comillas en el valor). */
function copyText(btn, text = btn.dataset.copy) {
  const done = () => {
    const o = btn.dataset.l || btn.textContent;
    btn.dataset.l = o;
    btn.textContent = 'Copiado ✓';
    setTimeout(() => (btn.textContent = o), 1600);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, done);
    return;
  }
  const t = document.createElement('textarea');
  t.value = text;
  document.body.appendChild(t);
  t.select();
  try {
    document.execCommand('copy');
  } catch (_e) {
    /* sin soporte: el botón igual confirma, el texto queda seleccionado */
  }
  t.remove();
  done();
}
/** Marca como activo solo el botón pulsado dentro de su grupo de pestañas. */
const setSeg = (btn) => {
  btn.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
};

/** Fecha/hora actual vista desde Colombia (los relojes del servicio son de Bogotá, no del dispositivo). */
const bogota = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
const hm = (h, m = 0) => {
  const ap = h >= 12 ? 'p.m.' : 'a.m.';
  const hh = h % 12 || 12;
  return hh + ':' + pad2(m) + ' ' + ap;
};
const fmtLeft = (min) => (min >= 60 ? Math.floor(min / 60) + ' h' + (min % 60 ? ' ' + (min % 60) + ' min' : '') : min + ' min');

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/**
 * Atributos de acción para el HTML generado (reemplazan a onclick="...").
 * El despachador de js/core/acciones.js escucha los eventos en document y ejecuta ACCIONES[nombre].
 * @param {string} nombre Clave en ACCIONES.
 * @param {...*} args Argumentos serializables (texto, números, booleanos).
 * @returns {string} Atributos listos para insertar en una etiqueta.
 */
const da = (nombre, ...args) => daEvento('act', nombre, ...args);
/** Igual que da(), pero para otro evento: 'input', 'change', 'error' o 'meta' (loadedmetadata). */
const daEvento = (tipo, nombre, ...args) =>
  `data-${tipo === 'act' ? 'act' : 'act-' + tipo}="${nombre}"${args.length ? ` data-args="${esc(JSON.stringify(args))}"` : ''}`;
