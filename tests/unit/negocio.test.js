const test = require('node:test');
const assert = require('node:assert/strict');
const { cargarPortal } = require('./cargar-portal');
const { portal, ctx } = cargarPortal();
const hora = (h, m = 0) => new ctx.Date(2026, 9, 30, h, m); // viernes
const estado = (h, m, fest) => {
  ctx.__d = hora(h, m);
  ctx.__f = fest;
  return portal('estadoComida(__d, __f)');
};

test('comedor: desayuno en curso entre 7:00 y 8:00', () => {
  const e = estado(7, 30, false);
  assert.equal(e.tipo, 'ahora');
  assert.equal(e.c.n, 'Desayuno');
  assert.equal(e.min, 30);
});
test('comedor: en domingo/festivo el desayuno empieza a las 8:00', () => {
  const e = estado(7, 30, true);
  assert.equal(e.tipo, 'luego');
  assert.equal(e.c.n, 'Desayuno');
  assert.equal(e.min, 30);
});
test('comedor: entre comidas indica la siguiente', () => {
  const e = estado(15, 0, false);
  assert.equal(e.tipo, 'luego');
  assert.equal(e.c.n, 'Cena');
});
test('comedor: pasada la cena queda cerrado y anuncia el desayuno de mañana', () => {
  const e = estado(21, 0, false);
  assert.equal(e.tipo, 'manana');
  assert.equal(e.c.n, 'Desayuno para llevar');
});

const ruta = (tipo, f, h, ahora) => {
  ctx.__a = [tipo, f, h, ahora];
  return portal('calcularRuta(...__a)');
};
test('ruta: cita médica sale 2 h antes y se pide el día anterior a las 5:00 p.m.', () => {
  const r = ruta('cita', '2026-11-10', '10:00', hora(9));
  assert.equal(r.hrs, 2);
  assert.equal(r.salida.getHours(), 8);
  assert.equal([r.limite.getDate(), r.limite.getHours()].join(':'), '9:17');
  assert.equal(r.tarde, false);
});
test('ruta: vuelo sale 3 h antes', () => {
  const r = ruta('aero', '2026-11-10', '15:30', hora(9));
  assert.equal(r.hrs, 3);
  assert.equal(r.salida.getHours(), 12);
  assert.equal(r.salida.getMinutes(), 30);
});
test('ruta: marca "tarde" cuando ya pasó el plazo', () => {
  assert.equal(ruta('cita', '2026-10-30', '10:00', hora(9)).tarde, true);
});
test('ruta: sin fecha u hora devuelve null', () => {
  assert.equal(ruta('cita', '', '10:00', hora(9)), null);
  assert.equal(ruta('cita', '2026-11-10', '', hora(9)), null);
});

test('sede: se identifica por slug o por id y rechaza desconocidas', () => {
  assert.equal(portal("sedeIdPorSlug('galery')"), 's1');
  assert.equal(portal("sedeIdPorSlug('corferias')"), 's3');
  assert.equal(portal("sedeIdPorSlug('s2')"), 's2');
  assert.equal(portal("sedeIdPorSlug('otra')"), null);
});
test('sede: ?sede= en la URL gana sobre la sede guardada', () => {
  const p = cargarPortal({ search: '?sede=Corferias', almacenInicial: { vitae_sede: 's1' } }).portal;
  assert.deepEqual({ ...p('identificarSede()') }, { id: 's3', origen: 'url' });
});
test('sede: sin URL usa la guardada; si está corrupta, pide elegir', () => {
  assert.equal(cargarPortal({ almacenInicial: { vitae_sede: 's2' } }).portal('identificarSede()').origen, 'guardada');
  assert.equal(cargarPortal({ almacenInicial: { vitae_sede: 'zzz' } }).portal('identificarSede()'), null);
});
test('sede: ?sede= inválido se ignora', () => {
  assert.equal(cargarPortal({ search: '?sede=%3Cscript%3E' }).portal('identificarSede()'), null);
});

test('videos: por sede, Bienestar solo aparece en Galery', () => {
  portal("currentSede = 's1'");
  assert.equal(portal("vlist().some(v => v.id === 'v11')"), true);
  portal("currentSede = 's2'");
  assert.equal(portal("vlist().some(v => v.id === 'v11')"), false);
});
