let rqFiltro = 'todos';
let rqBusca = '';

function renderRQ() {
  const el = $('rqList');
  if (!el) return;
  const L = SE_PUEDE.filter(
    (x) => (rqFiltro === 'todos' || x.r === rqFiltro) && (!rqBusca || norm(x.q + ' ' + x.d).includes(norm(rqBusca)))
  );
  el.innerHTML = L.length
    ? L.map(
        (x) =>
          `<details class="qa"><summary><span>${x.q}</span><em class="pill ${x.r}">${RQ_TXT[x.r]}</em></summary><p>${x.d}</p></details>`
      ).join('')
    : '<p class="empty">No encontramos esa regla. Pregunta en recepción.</p>';
}
function setRQ(k, btn) {
  rqFiltro = k;
  btn.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
  renderRQ();
}
function buscarRQ(v) {
  rqBusca = v;
  renderRQ();
}
