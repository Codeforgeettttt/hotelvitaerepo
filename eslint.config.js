// Configuración de ESLint (formato "flat"). Los scripts del navegador se cargan como scripts
// clásicos que comparten el ámbito global, por eso no hay import/export. Para que `no-undef`
// detecte referencias a funciones o variables que no existen, los globales del portal se calculan
// leyendo las declaraciones de nivel superior de js/**: no hay una lista manual que se desactualice.
const fs = require('fs');
const path = require('path');
const js = require('@eslint/js');
const globals = require('globals');

function archivosJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = path.join(dir, e.name);
    return e.isDirectory() ? archivosJs(ruta) : ruta.endsWith('.js') ? [ruta] : [];
  });
}

/** Nombres declarados en la columna 0 (nivel superior) de los scripts del portal. */
function globalesDelPortal() {
  const nombres = new Set();
  const patron = /^(?:async\s+)?function\s+([\w$]+)|^(?:const|let|var)\s+([\w$]+)/gm;
  for (const archivo of archivosJs(path.join(__dirname, 'js'))) {
    for (const m of fs.readFileSync(archivo, 'utf8').matchAll(patron)) nombres.add(m[1] || m[2]);
  }
  return Object.fromEntries([...nombres].map((n) => [n, 'writable']));
}

module.exports = [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: { sourceType: 'script', ecmaVersion: 2022, globals: { ...globals.browser, ...globalesDelPortal() } },
    rules: {
      // Las funciones se usan desde otros archivos (ámbito global compartido), así que no se puede
      // saber por archivo si una declaración queda sin uso.
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-empty': ['error', { allowEmptyCatch: false }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'warn'
    }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022,
      // Las pruebas de navegador ejecutan funciones del portal con page.evaluate().
      globals: { ...globals.node, ...globals.browser, ...globalesDelPortal() }
    }
  }
];
