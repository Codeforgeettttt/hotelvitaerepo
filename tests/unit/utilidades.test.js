const test = require('node:test');
const assert = require('node:assert/strict');
const { cargarPortal } = require('./cargar-portal');
const { portal, ctx } = cargarPortal();

test('fmtDur redondea antes de separar (nunca "0:60")', () => {
  assert.equal(portal('fmtDur(59.6)'), '1:00');
  assert.equal(portal('fmtDur(80)'), '1:20');
  assert.equal(portal('fmtDur(9.4)'), '0:09');
});
test('hm formatea hora en 12 h con a.m./p.m.', () => {
  assert.equal(portal('hm(0,0)'), '12:00 a.m.');
  assert.equal(portal('hm(12,5)'), '12:05 p.m.');
  assert.equal(portal('hm(17,0)'), '5:00 p.m.');
});
test('fmtLeft muestra minutos u horas', () => {
  assert.equal(portal('fmtLeft(45)'), '45 min');
  assert.equal(portal('fmtLeft(60)'), '1 h');
  assert.equal(portal('fmtLeft(135)'), '2 h 15 min');
});
test('telHref deja solo dígitos y +', () => {
  assert.equal(portal("telHref('318 387-4491')"), 'tel:3183874491');
});
test('waLink codifica el texto y antepone 57', () => {
  assert.equal(portal("waLink('3183874491','Hola ¿qué tal?')"), 'https://wa.me/573183874491?text=Hola%20%C2%BFqu%C3%A9%20tal%3F');
});
test('norm ignora tildes y mayúsculas', () => {
  assert.equal(portal("norm('ÁRBOL Niño')"), 'arbol nino');
});
test('esc neutraliza HTML y comillas', () => {
  ctx.__t = `<a href="x" onclick='y'>&`;
  assert.equal(portal('esc(__t)'), '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;');
});
test('almacen devuelve el valor por defecto si el JSON está corrupto', () => {
  const { portal: p } = cargarPortal({ almacenInicial: { vitae_vistos: '{no es json' } });
  assert.equal(JSON.stringify(p("almacen.leer('vitae_vistos', ['x'])")), '["x"]');
});
