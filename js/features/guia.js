let guiaTab = 'esencia';
function renderGuia() {
  const el = $('guiaBody');
  if (!el) return;
  const Es = GLOBAL.esencia,
    s = SEDES[currentSede];
  if (guiaTab === 'esencia') {
    el.innerHTML = `<div class="box"><p class="lead">${Es.bienvenida}</p></div>
      <div class="pills4">${Es.principios.map((p) => `<span>${p}</span>`).join('')}</div>
      ${acc('Nuestra misión', `<p class="lead">${Es.mision}</p>`)}
      <div class="box"><b class="box-t">Tu sede</b><div class="kv"><b>Sede</b><span>${s.nombre}</span></div><div class="kv"><b>Dirección</b><span>${s.direccion}</span></div><div class="kv"><b>Atención</b><span>${GLOBAL.atencion}</span></div></div>`;
  } else {
    const L = guiaTab === 'derechos' ? Es.derechos : Es.deberes;
    el.innerHTML = `<div class="cards2">${L.map((t, i) => `<div class="mini"><span class="mini-n">${guiaTab === 'derechos' ? '✓' : i + 1}</span><span>${t}</span></div>`).join('')}</div>`;
  }
}
function setGuia(k, btn) {
  guiaTab = k;
  setSeg(btn);
  renderGuia();
}
