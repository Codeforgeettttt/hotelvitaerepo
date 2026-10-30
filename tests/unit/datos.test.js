const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { cargarPortal, RAIZ } = require('./cargar-portal');
const { portal } = cargarPortal();
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));
const videos = portal('VIDEOS'),
  items = portal('ITEMS'),
  sedes = portal('SEDES');

test('videos: ids únicos, categorías y secciones existentes', () => {
  assert.equal(new Set(videos.map((v) => v.id)).size, videos.length);
  const cats = portal('CATEGORIAS').map((c) => c.id),
    secs = items.map((i) => i.id);
  for (const v of videos) {
    assert.ok(cats.includes(v.cat), `${v.id}: categoría ${v.cat}`);
    for (const s of v.secciones || []) assert.ok(secs.includes(s), `${v.id}: sección ${s}`);
    for (const s of v.sedes || []) assert.ok(s in sedes, `${v.id}: sede ${s}`);
    assert.match(v.dur, /^\d+:\d{2}$/, `${v.id}: duración`);
  }
});
test('videos: los archivos mp4 y las portadas existen', () => {
  for (const v of videos) {
    if (v.mp4) assert.ok(existe(v.mp4), v.mp4);
    assert.ok(existe(v.poster), v.poster);
  }
});
test('secciones: íconos existentes y sedes válidas', () => {
  for (const i of items) {
    assert.ok(existe(i.ic), i.ic);
    for (const s of i.sedes || []) assert.ok(s in sedes, `${i.id}: sede ${s}`);
  }
});
test('secciones: cada ITEM tiene su renderizador y los avisos apuntan a secciones reales', () => {
  const vistas = portal('Object.keys(DETALLE_VISTAS)');
  for (const i of items.filter((x) => x.id !== 'videos')) assert.ok(vistas.includes(i.id), `falta vista ${i.id}`);
  for (const a of portal('AVISOS'))
    assert.ok(
      items.some((i) => i.id === a.destino),
      a.destino
    );
});
test('sedes: slugs únicos, datos completos y QR de wifi existente', () => {
  const todas = Object.values(sedes);
  assert.equal(new Set(todas.map((s) => s.slug)).size, todas.length);
  for (const s of todas) {
    assert.ok(s.nombre && s.direccion && /^\d{10}$/.test(s.contacto.tel), s.slug);
    if (s.wifi.qr) assert.ok(existe(s.wifi.qr), s.wifi.qr);
  }
});
test('contenido: protocolos de emergencia completos y teléfonos válidos', () => {
  const E = portal('GLOBAL.emergencias');
  for (const k of ['sismos', 'incendios', 'evacuar']) assert.ok(E[k].length >= 5, k);
  for (const [nombre, tel] of E.telefonos) assert.ok(nombre && /^\d{3,12}$/.test(tel), nombre);
});
test('contenido: reglas "¿Se puede…?" con tipos válidos', () => {
  const tipos = Object.keys(portal('RQ_TXT'));
  for (const r of portal('SE_PUEDE')) assert.ok(tipos.includes(r.r) && r.q && r.d, r.q);
});
test('servicios: los enlaces externos usan https', () => {
  for (const [k, v] of Object.entries(portal('SERVICIOS.marykay'))) if (/^http/.test(v)) assert.match(v, /^https:\/\//, k);
});
