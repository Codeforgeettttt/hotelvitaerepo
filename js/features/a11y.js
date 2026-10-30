/** Preferencias de accesibilidad (tamaño de letra, alto contraste, menos movimiento); se guardan en el dispositivo. */
let a11y = { t: 0, c: false, m: false };
Object.assign(a11y, almacen.leer(CLAVES.a11y, {}));
function aplicarA11y() {
  const r = document.documentElement;
  r.dataset.text = a11y.t;
  r.dataset.contrast = a11y.c ? 'high' : '';
  r.dataset.motion = a11y.m ? 'reduce' : '';
  document.querySelectorAll('[data-a11y-t]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.a11yT === a11y.t)));
  const c = $('a11yContrast'),
    m = $('a11yMotion');
  if (c) c.setAttribute('aria-pressed', String(a11y.c));
  if (m) m.setAttribute('aria-pressed', String(a11y.m));
  almacen.guardar(CLAVES.a11y, a11y);
}
function setTexto(n) {
  a11y.t = n;
  aplicarA11y();
}
function toggleA11y(k) {
  a11y[k] = !a11y[k];
  aplicarA11y();
}
function resetA11y() {
  a11y = { t: 0, c: false, m: false };
  aplicarA11y();
}
function openA11y() {
  const d = $('a11yDlg');
  if (!d.open) d.showModal();
}
