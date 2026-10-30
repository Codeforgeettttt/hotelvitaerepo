const test = require('node:test');
const assert = require('node:assert/strict');
const { cargarPortal } = require('./cargar-portal');
const { portal } = cargarPortal();
const habs = portal('Object.keys(MAPA_HAB)');
const salidas = portal('Object.keys(MAPA_EXITS)');

test('mapa: cada habitación tiene salida por defecto válida', () => {
  for (const h of habs) assert.ok(salidas.includes(portal(`MAPA_HAB['${h}'].w`)), h);
});
test('mapa: toda ruta empieza dentro del plano y termina en la salida elegida', () => {
  for (const h of habs)
    for (const e of salidas) {
      const pts = portal(`mapaRuta('${h}','${e}')`);
      assert.ok(pts.length >= 2, `${h}→${e}`);
      for (const [x, y] of pts) assert.ok(x >= 60 && x <= 1200 && y >= 160 && y <= 870, `${h}→${e} fuera del plano`);
      const [fx, fy] = pts[pts.length - 1],
        [sx, sy] = portal(`MAPA_EXITS['${e}'].pt`);
      assert.ok(Math.hypot(fx - sx, fy - sy) <= 20, `${h}→${e} no llega a la salida`);
    }
});
test('mapa: solo está disponible en Galery', () => {
  portal("currentSede = 's1'");
  assert.equal(portal('mapaDisponible()'), true);
  portal("currentSede = 's3'");
  assert.equal(portal('mapaDisponible()'), false);
});
test('mapa: los pasos escritos existen para cada combinación', () => {
  for (const h of habs) for (const e of salidas) assert.ok(portal(`mapaPasos('${h}','${e}')`).length >= 3);
});
