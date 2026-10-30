/**
 * Carga los scripts del portal (todos menos main.js) en un contexto aislado de Node con un
 * DOM mínimo simulado, para probar la lógica pura sin navegador.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..', '..');
// El orden es el mismo de index.html (se lee de allí para no duplicarlo).
const ORDEN = [...fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((f) => f !== 'js/main.js');

function cargarPortal({ search = '', almacenInicial = {} } = {}) {
  const datos = { ...almacenInicial };
  const nodoVacio = () => ({ addEventListener() {}, classList: { toggle() {} }, setAttribute() {}, dataset: {} });
  const ctx = vm.createContext({
    console,
    Date,
    Math,
    JSON,
    Set,
    URLSearchParams,
    Intl,
    isFinite,
    isNaN,
    parseInt,
    String,
    Number,
    Object,
    Array,
    document: { getElementById: nodoVacio, querySelectorAll: () => [], documentElement: { dataset: {} } },
    localStorage: {
      getItem: (k) => (k in datos ? datos[k] : null),
      setItem: (k, v) => {
        datos[k] = String(v);
      }
    },
    location: { search, hash: '', pathname: '/' },
    history: { replaceState() {}, pushState() {} },
    window: { addEventListener() {} },
    setTimeout,
    setInterval: () => 0
  });
  for (const f of ORDEN) vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f });
  /** Evalúa una expresión dentro del portal (las const/let globales no cuelgan del contexto). */
  const portal = (expr) => vm.runInContext(expr, ctx);
  return { portal, ctx, RAIZ, almacen: datos };
}
module.exports = { cargarPortal, RAIZ };
