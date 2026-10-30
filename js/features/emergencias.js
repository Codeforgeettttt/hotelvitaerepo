let emTab = 'sismos';
function renderEm() {
  const el = $('emSteps');
  if (!el) return;
  const L = GLOBAL.emergencias[emTab];
  el.innerHTML = L.map(
    (t, i) =>
      `<button class="step" aria-pressed="false" ${da('toggleStep')}><span class="step-n">${i + 1}</span><span class="step-t">${t}</span><span class="step-ok">${CHECK_I}</span></button>`
  ).join('');
}
function setEm(k, btn) {
  emTab = k;
  setSeg(btn);
  renderEm();
}
