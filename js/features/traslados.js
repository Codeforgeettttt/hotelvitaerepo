/** Traslados: calculadora de la ruta de transporte. */
let trKind = 'cita';
const isoDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
function setTrKind(k, btn) {
  trKind = k;
  setSeg(btn);
  trCalc();
}
/**
 * Calcula a qué hora debe salir la ruta y hasta cuándo pedirla.
 * Reglas del servicio: mínimo 2 h antes de una cita (3 h antes de un vuelo) y solicitud
 * un día antes, hasta las 5:00 p.m.
 * @param {'cita'|'aero'} tipo
 * @param {string} fecha "AAAA-MM-DD"
 * @param {string} hora "HH:MM"
 * @param {Date} ahora Hora de Colombia (por defecto, la actual).
 * @returns {{hrs:number, evento:Date, salida:Date, limite:Date, tarde:boolean}|null} null si faltan datos o son inválidos.
 */
function calcularRuta(tipo, fecha, hora, ahora = bogota()) {
  if (!fecha || !hora) return null;
  const [Y, M, D] = fecha.split('-').map(Number),
    [h, mi] = hora.split(':').map(Number);
  const evento = new Date(Y, M - 1, D, h, mi);
  if (isNaN(evento)) return null;
  const hrs = tipo === 'aero' ? 3 : 2;
  const limite = new Date(Y, M - 1, D - 1, 17, 0);
  return { hrs, evento, salida: new Date(evento.getTime() - hrs * 3600000), limite, tarde: ahora > limite };
}
function trCalc() {
  const out = $('trOut');
  if (!out) return;
  const r = calcularRuta(trKind, $('trDate').value, $('trTime').value);
  if (!r) {
    out.innerHTML = '<p class="empty">Elige la fecha y la hora para calcular.</p>';
    return;
  }
  const { hrs, evento, salida, limite, tarde } = r;
  const f = (d) => d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  const t = (d) => hm(d.getHours(), d.getMinutes());
  out.innerHTML = `
    <div class="res"><span class="res-n">1</span><div><small>Pide tu ruta antes del</small><b>${f(limite)}, ${t(limite)}</b>
      <span class="pill ${tarde ? 'cond' : 'ok'}">${tarde ? '! El plazo ya pasó: escribe a Ruta y pregunta' : '✓ Estás a tiempo'}</span></div></div>
    <div class="res"><span class="res-n">2</span><div><small>${trKind === 'aero' ? 'Tu vuelo' : 'Tu cita'}: ${f(evento)}, ${t(evento)}</small><b>La ruta debe salir ${t(salida)} o antes</b>
      <span class="res-s">Mínimo ${hrs} horas antes ${trKind === 'aero' ? 'del vuelo' : 'de la cita'}.</span></div></div>`;
}
