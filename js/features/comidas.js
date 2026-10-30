// ---------- ALIMENTACIÓN ----------
const COMIDAS = [
  { n: 'Desayuno para llevar', e: '🥡', a: 5 * 60, b: 7 * 60 },
  { n: 'Desayuno', e: '☕', a: 7 * 60, b: 8 * 60, fest: [8 * 60, 9 * 60] },
  { n: 'Almuerzo', e: '🍲', a: 12 * 60, b: 14 * 60 },
  { n: 'Cena', e: '🌙', a: 17 * 60, b: 18 * 60 }
];
let fest = bogota().getDay() === 0; // domingo o festivo (desayuno 8:00–9:00)
/** Horario del día: en domingo o festivo el desayuno se corre una hora. */
const comidasHoy = (esFestivo = fest) =>
  COMIDAS.map((c) => ({ ...c, a: esFestivo && c.fest ? c.fest[0] : c.a, b: esFestivo && c.fest ? c.fest[1] : c.b }));
/**
 * Qué comida está sirviéndose, cuál sigue o si el comedor cerró por hoy.
 * @param {Date} d Hora de Colombia (por defecto, la actual).
 * @param {boolean} esFestivo Usa el horario de domingos y festivos.
 * @returns {{tipo:'ahora'|'luego'|'manana', c:object, min?:number}}
 */
function estadoComida(d = bogota(), esFestivo = fest) {
  const m = d.getHours() * 60 + d.getMinutes(),
    L = comidasHoy(esFestivo);
  const cur = L.find((c) => m >= c.a && m < c.b);
  if (cur) return { tipo: 'ahora', c: cur, min: cur.b - m };
  const nxt = L.find((c) => c.a > m);
  if (nxt) return { tipo: 'luego', c: nxt, min: nxt.a - m };
  return { tipo: 'manana', c: L[0] };
}
function liveMealHTML() {
  const s = estadoComida();
  if (s.tipo === 'ahora')
    return `<span class="dot on"></span><span><small>Ahora · ${s.c.n}</small><b>Termina en ${fmtLeft(s.min)}</b></span>`;
  if (s.tipo === 'luego')
    return `<span class="dot"></span><span><small>Siguiente · ${s.c.n}</small><b>Empieza a las ${hm(Math.floor(s.c.a / 60), s.c.a % 60)} (en ${fmtLeft(s.min)})</b></span>`;
  return `<span class="dot"></span><span><small>Comedor cerrado por hoy</small><b>Mañana · ${s.c.n} ${hm(Math.floor(s.c.a / 60), s.c.a % 60)}</b></span>`;
}
function renderMeals() {
  const el = $('mealList');
  if (!el) return;
  const s = estadoComida(),
    L = comidasHoy(),
    d = bogota(),
    m = d.getHours() * 60 + d.getMinutes();
  $('mealLive').innerHTML = liveMealHTML();
  el.innerHTML = L.map((c) => {
    const on = s.tipo === 'ahora' && s.c.n === c.n,
      next = s.tipo === 'luego' && s.c.n === c.n,
      past = m >= c.b;
    const pct = on ? Math.round(((m - c.a) / (c.b - c.a)) * 100) : 0;
    return `<div class="meal${on ? ' now' : ''}${next ? ' next' : ''}${past ? ' past' : ''}">
      <span class="meal-e" aria-hidden="true">${c.e}</span>
      <span class="meal-t"><b>${c.n}</b><small>${hm(Math.floor(c.a / 60), c.a % 60)} – ${hm(Math.floor(c.b / 60), c.b % 60)}</small>${on ? `<i class="bar"><u style="width:${pct}%"></u></i>` : ''}</span>
      <em>${on ? 'Ahora' : next ? 'Sigue' : past ? 'Pasó' : ''}</em></div>`;
  }).join('');
  document.querySelectorAll('.setfest').forEach((b) => b.setAttribute('aria-pressed', String(fest)));
}
function toggleFest() {
  fest = !fest;
  renderMeals();
}

/** Refresca los textos «Ahora / Siguiente» (tarjeta del inicio y lista de Alimentación). */
function actualizarComidaEnVivo() {
  document.querySelectorAll('.live-meal').forEach((e) => (e.innerHTML = liveMealHTML()));
  if ($('mealList')) renderMeals();
}
