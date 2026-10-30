#!/usr/bin/env node
/**
 * Pruebas de flujos en navegador real (Playwright + Chromium).
 * Requiere:  npm i -D playwright && npx playwright install chromium
 * Uso:       node tests/e2e/flujos.js
 * Cubre: acceso, selección de sede, contenido por sede, videos, categorías, mapa, accesibilidad (incluido el
 * contraste WCAG AA medido con axe-core), seguridad (CSP, sin handlers inline) y móvil.
 */
/* global axe -- axe-core se inyecta en la página con page.evaluate(axeSource) */
const { chromium } = require('playwright');
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const assert = require('node:assert/strict');
const { crearServidor } = require('../../scripts/servir');

const resultados = [];
async function caso(nombre, fn) {
  try {
    await fn();
    resultados.push([true, nombre]);
    console.log('  ok   ' + nombre);
  } catch (e) {
    resultados.push([false, nombre]);
    console.log('  FALLA ' + nombre + '\n       ' + String(e.message).split('\n')[0]);
  }
}

(async () => {
  const servidor = crearServidor();
  await new Promise((r) => servidor.listen(0, r));
  const base = 'http://localhost:' + servidor.address().port + '/';
  const navegador = await chromium.launch();
  const errores = [];

  /** Página nueva con almacenamiento limpio; registra errores de JS propios (se ignora la red externa). */
  const abrir = async (ruta = '', vp = { width: 390, height: 780 }) => {
    const ctx = await navegador.newContext({ viewport: vp });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errores.push(ruta + ' · ' + e.message));
    p.on('console', (m) => {
      if (m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text())) errores.push(ruta + ' · ' + m.text());
    });
    await p.goto(base + ruta);
    return p;
  };

  console.log('\n1. Acceso y selección de sede');
  await caso('sin sede: muestra el selector con las 3 sedes y sin menú', async () => {
    const p = await abrir();
    assert.equal(await p.locator('.sede-btn').count(), 3);
    assert.equal(await p.locator('#mainNav').isHidden(), true);
    await p.context().close();
  });
  await caso('elegir sede abre el inicio y la recuerda al recargar', async () => {
    const p = await abrir();
    await p.click('.sede-btn:has-text("Galerías")');
    assert.match(await p.textContent('#sedeChipName'), /Galerías/);
    assert.equal(await p.locator('#panel-home.active').count(), 1);
    await p.reload();
    assert.match(await p.textContent('#sedeChipName'), /Galerías/);
    await p.context().close();
  });
  await caso('?sede=galery (QR) entra directo y un valor inválido pide elegir', async () => {
    const p = await abrir('?sede=galery');
    assert.match(await p.textContent('#sedeChipName'), /Galery/);
    const q = await abrir('?sede=<script>');
    assert.equal(await q.locator('.sede-btn').count(), 3);
    await p.context().close();
    await q.context().close();
  });
  await caso('«Cambiar» sede vuelve al selector y el botón atrás regresa al inicio', async () => {
    const p = await abrir('?sede=galery');
    await p.click('#sedeChip');
    assert.equal(await p.locator('#panel-selector.active').count(), 1);
    await p.goBack();
    assert.equal(await p.locator('#panel-home.active').count(), 1);
    await p.context().close();
  });

  console.log('\n2. Contenido según la sede');
  await caso('Galery: wifi real con QR, servicios adicionales y mapa', async () => {
    const p = await abrir('?sede=galery');
    assert.ok(await p.locator('.card:has-text("Servicios adicionales")').count());
    await p.evaluate(() => openDetail('wifi'));
    assert.match(await p.textContent('#detailContent'), /Hotelvitae2024/);
    assert.equal(await p.locator('.wifi-qr img').count(), 1);
    await p.evaluate(() => openDetail('emergencias'));
    assert.equal(await p.locator('.mapcard').count(), 1);
    await p.context().close();
  });
  await caso('Corferias: wifi pendiente, sin servicios ni mapa, y sin video de Bienestar', async () => {
    const p = await abrir('?sede=corferias');
    assert.equal(await p.locator('.card:has-text("Servicios adicionales")').count(), 0);
    await p.evaluate(() => openDetail('wifi'));
    assert.match(await p.textContent('#detailContent'), /aún no están publicadas/);
    await p.evaluate(() => openDetail('emergencias'));
    assert.equal(await p.locator('.mapcard').count(), 0);
    await p.evaluate(() => openDetail('mapa')); // acceso directo no permitido: vuelve al inicio
    assert.equal(await p.locator('#panel-home.active').count(), 1);
    await p.evaluate(() => go('d-videos'));
    assert.equal(await p.locator('#videosContent .vcard').count(), 10);
    await p.context().close();
  });
  await caso('Galery: 11 videos y servicios con los dos enlaces de Mary Kay', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => go('d-videos'));
    assert.equal(await p.locator('#videosContent .vcard').count(), 11);
    await p.evaluate(() => openDetail('servicios'));
    const enlaces = await p.locator('.svc a.cta').evaluateAll((a) => a.map((x) => x.href));
    assert.equal(enlaces.length, 2);
    assert.ok(enlaces.every((h) => h.startsWith('https://')));
    await p.context().close();
  });

  console.log('\n3. Videos y categorías');
  await caso('filtrar por categoría muestra solo esa sección y "Todos" restablece', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => go('d-videos'));
    const total = await p.locator('#videosContent .vcard').count();
    await p.click('.chip:has-text("Llegada y bienvenida")');
    const filtrados = await p.locator('#videosContent .vcard').count();
    assert.ok(filtrados > 0 && filtrados < total);
    await p.click('.chip:has-text("Todos")');
    assert.equal(await p.locator('#videosContent .vcard').count(), total);
    await p.context().close();
  });
  await caso('reproductor: abre, navega, marca "visto" y cierra con Escape', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => go('d-videos'));
    await p.locator('#videosContent .vcard').first().click();
    assert.equal(await p.locator('#vmodal[open]').count(), 1);
    assert.match(await p.textContent('#vmCount'), /^01 \/ 11/);
    await p.click('#vmNext');
    assert.match(await p.textContent('#vmCount'), /^02 \/ 11/);
    await p.keyboard.press('Escape');
    assert.equal(await p.locator('#vmodal[open]').count(), 0);
    // el evento «close» del diálogo se dispara en una tarea posterior: se espera en vez de medir al instante
    await p.waitForFunction(() => document.getElementById('vmMedia').innerHTML === '');
    assert.equal(await p.locator('#videosContent .vcard.seen').count(), 2);
    await p.reload(); // lo visto se recuerda
    await p.evaluate(() => go('d-videos'));
    assert.equal(await p.locator('#videosContent .vcard.seen').count(), 2);
    await p.context().close();
  });
  await caso('video faltante muestra mensaje en lugar de un reproductor roto', async () => {
    const p = await abrir('?sede=galery');
    await p.route('**/assets/videos/video-02.mp4', (r) => r.abort());
    await p.evaluate(() => openVideo('v2'));
    await p.waitForSelector('.vfail', { timeout: 5000 });
    await p.context().close();
  });

  console.log('\n4. Secciones interactivas');
  await caso('todas las secciones abren sin errores y con un solo <h1>', async () => {
    const p = await abrir('?sede=galery');
    for (const id of ['wifi', 'horarios', 'traslados', 'llave', 'reglas', 'emergencias', 'contacto', 'guia', 'servicios', 'mapa']) {
      await p.evaluate((i) => openDetail(i), id);
      assert.equal(await p.locator('#detailContent h1').count(), 1, id);
    }
    await p.context().close();
  });
  await caso('traslados: la calculadora responde a fecha y hora', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('traslados'));
    await p.fill('#trDate', '2030-05-14');
    await p.fill('#trTime', '10:00');
    await p.dispatchEvent('#trTime', 'input');
    assert.match(await p.textContent('#trOut'), /8:00 a\.m\./);
    await p.context().close();
  });
  await caso('reglas: el buscador filtra', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('reglas'));
    const antes = await p.locator('#rqList .qa').count();
    await p.fill('#rqSearch', 'mascota');
    const despues = await p.locator('#rqList .qa').count();
    assert.ok(despues >= 1 && despues < antes);
    await p.context().close();
  });
  await caso('wifi: copiar contraseña con comillas o símbolos usa data-copy', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('wifi'));
    const copiado = await p.locator('.copybtn').nth(1).getAttribute('data-copy');
    assert.equal(copiado, '255220*GA');
    await p.context().close();
  });
  await caso('emergencias: pestañas Sismo / Incendio / Al evacuar cambian los pasos', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('emergencias'));
    const n = async () => p.locator('#emSteps .step').count();
    const sismo = await n();
    await p.click('#detailContent .seg button:has-text("Al evacuar")');
    assert.equal(await n(), 8);
    await p.click('#detailContent .seg button:has-text("Incendio")');
    assert.notEqual(await n(), 0);
    assert.ok(sismo > 0);
    await p.context().close();
  });

  console.log('\n5. Mapa de evacuación');
  await caso('tocar una habitación dibuja la ruta; la salida y el modo sanitario la cambian', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('mapa'));
    assert.equal(await p.locator('.m-route').count(), 0);
    await p.click('.m-btn[aria-label="Habitación 106"]');
    assert.equal(await p.locator('.m-route').count(), 1);
    assert.match(await p.textContent('.rsteps'), /recepción/);
    const d1 = await p.getAttribute('.m-route', 'd');
    await p.click('.rchips button:has-text("Salida este")');
    assert.notEqual(await p.getAttribute('.m-route', 'd'), d1);
    await p.click('button:has-text("Ruta sanitaria")');
    assert.equal(await p.locator('.m-route.red').count(), 1);
    await p.context().close();
  });
  await caso('mapa: se puede operar con teclado (Enter sobre la habitación)', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate(() => openDetail('mapa'));
    await p.focus('.m-btn[aria-label="Habitación 109"]');
    await p.keyboard.press('Enter');
    assert.equal(await p.locator('.m-route').count(), 1);
    await p.context().close();
  });

  console.log('\n6. Accesibilidad y móvil');
  await caso('accesibilidad: letra grande y alto contraste se aplican y persisten', async () => {
    const p = await abrir('?sede=galery');
    await p.click('#a11yBtn');
    await p.click('[data-a11y-t="2"]');
    await p.click('#a11yContrast');
    assert.equal(await p.evaluate(() => document.documentElement.dataset.text), '2');
    await p.reload();
    assert.equal(await p.evaluate(() => document.documentElement.dataset.contrast), 'high');
    await p.context().close();
  });
  for (const ancho of [320, 390, 768, 1280]) {
    await caso('sin desbordamiento horizontal a ' + ancho + ' px en todas las pantallas', async () => {
      const p = await abrir('?sede=galery', { width: ancho, height: 800 });
      const pantallas = [
        'go("inicio")',
        'go("d-videos")',
        ...['wifi', 'horarios', 'traslados', 'llave', 'reglas', 'emergencias', 'contacto', 'guia', 'servicios', 'mapa'].map(
          (i) => `openDetail("${i}")`
        )
      ];
      for (const js of pantallas) {
        await p.evaluate(js);
        const desborda = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(desborda, false, js);
      }
      await p.context().close();
    });
  }
  await caso('móvil: botones principales tienen área táctil de al menos 40 px', async () => {
    const p = await abrir('?sede=galery');
    const chicos = await p.evaluate(
      () =>
        [...document.querySelectorAll('#homeContent .card, #homeContent .btn-primary, #mainNav a')]
          .filter((e) => e.offsetParent)
          .map((e) => e.getBoundingClientRect())
          .filter((r) => r.height < 40).length
    );
    assert.equal(chicos, 0);
    await p.context().close();
  });
  await caso('imágenes de contenido tienen alt y los controles sin texto tienen nombre accesible', async () => {
    const p = await abrir('?sede=galery');
    const sinAlt = await p.evaluate(() => [...document.images].filter((i) => !i.hasAttribute('alt')).length);
    const sinNombre = await p.evaluate(
      () =>
        [...document.querySelectorAll('button, a[href]')].filter(
          (b) => b.offsetParent && !(b.textContent.trim() || b.getAttribute('aria-label'))
        ).length
    );
    assert.equal(sinAlt, 0);
    assert.equal(sinNombre, 0);
    await p.context().close();
  });

  console.log('\n7. Contraste y seguridad');
  const PANTALLAS = [
    'go("inicio")',
    'go("d-videos")',
    ...['wifi', 'horarios', 'traslados', 'llave', 'reglas', 'emergencias', 'contacto', 'guia', 'servicios', 'mapa'].map(
      (i) => `openDetail("${i}")`
    )
  ];
  /** Violaciones de contraste (WCAG AA) en la página tal como está en este momento. */
  const violacionesContraste = async (p) => {
    await p.evaluate(axeSource);
    const r = await p.evaluate(() => axe.run(document, { runOnly: ['color-contrast'] }));
    return r.violations.flatMap((v) =>
      v.nodes.map((n) => n.target.join(' ') + ' ' + (n.any[0] && n.any[0].data ? n.any[0].data.contrastRatio : '?'))
    );
  };
  for (const alto of [false, true]) {
    await caso('contraste AA en todas las pantallas' + (alto ? ' con alto contraste' : ''), async () => {
      // movimiento reducido: así no se mide a mitad de una animación de entrada
      const ctx = await navegador.newContext({ viewport: { width: 390, height: 800 }, reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      await p.goto(base + '?sede=galery');
      if (alto)
        await p
          .click('#a11yBtn')
          .then(() => p.click('#a11yContrast'))
          .then(() => p.keyboard.press('Escape'));
      const fallas = [];
      for (const js of PANTALLAS) {
        await p.evaluate(js);
        fallas.push(...(await violacionesContraste(p)).map((f) => js + ' → ' + f));
      }
      assert.deepEqual(fallas, []);
      await ctx.close();
    });
  }
  await caso('contraste AA en estados ocultos: diálogos, mapa sanitario, pestañas y plazo vencido', async () => {
    const ctx = await navegador.newContext({ viewport: { width: 390, height: 800 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(base + '?sede=galery');
    const fallas = [];
    const medir = async (nombre) => fallas.push(...(await violacionesContraste(p)).map((f) => nombre + ' → ' + f));
    await p.click('#a11yBtn');
    await medir('diálogo de accesibilidad');
    await p.keyboard.press('Escape');
    await p.evaluate('openVideo("v2")');
    await medir('reproductor de video');
    await p.keyboard.press('Escape');
    await p.evaluate('openDetail("emergencias")');
    for (const t of ['Incendio', 'Al evacuar']) {
      await p.click(`#detailContent .seg button:has-text("${t}")`);
      await p.click('#emSteps .step >> nth=0'); // un paso marcado
      await medir('emergencias · ' + t);
    }
    await p.evaluate('openDetail("mapa")');
    await p.click('.m-btn[aria-label="Habitación 106"]');
    await p.click('button:has-text("Ruta sanitaria")');
    await medir('mapa sanitario');
    await p.evaluate('openDetail("traslados")');
    await p.fill('#trDate', '2020-01-01'); // fecha pasada: aparece el aviso de plazo vencido
    await medir('traslados · plazo vencido');
    await p.evaluate('openDetail("reglas")');
    for (const t of ['No se puede', 'Con condición', 'Bueno saber']) {
      await p.click(`#detailContent .seg button:has-text("${t}")`);
      await medir('reglas · ' + t);
    }
    assert.deepEqual(fallas, []);
    await ctx.close();
  });
  await caso('ninguna pantalla usa atributos de evento en línea (onclick, onchange, ...)', async () => {
    const p = await abrir('?sede=galery');
    for (const js of PANTALLAS) {
      await p.evaluate(js);
      const inline = await p.evaluate(() =>
        [...document.querySelectorAll('*')].flatMap((e) =>
          e
            .getAttributeNames()
            .filter((a) => /^on/i.test(a))
            .map((a) => e.tagName + '[' + a + ']')
        )
      );
      assert.deepEqual(inline, [], js);
    }
    await p.evaluate('openVideo("v2")');
    assert.deepEqual(await p.evaluate(() => [...document.querySelectorAll('[onerror],[onclick],[onloadedmetadata]')].length), 0);
    await p.context().close();
  });
  await caso('la política CSP existe y bloquea un script en línea inyectado', async () => {
    const ctx = await navegador.newContext();
    const p = await ctx.newPage(); // sin el registro de errores: aquí la violación es la intención
    await p.goto(base + '?sede=galery');
    assert.match(await p.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'), /script-src 'self'/);
    const ejecuto = await p.evaluate(async () => {
      const bloqueado = new Promise((r) => document.addEventListener('securitypolicyviolation', () => r(true), { once: true }));
      const sc = document.createElement('script');
      sc.textContent = 'window.__inyectado = true';
      document.body.appendChild(sc);
      await Promise.race([bloqueado, new Promise((r) => setTimeout(r, 500))]);
      return window.__inyectado === true;
    });
    assert.equal(ejecuto, false);
    await ctx.close();
  });
  await caso('los botones siguen funcionando tras repintar (teclado: Enter y Espacio en el plano)', async () => {
    const p = await abrir('?sede=galery');
    await p.evaluate('openDetail("mapa")');
    await p.focus('.m-btn[aria-label="Habitación 108"]');
    await p.keyboard.press('Space');
    assert.equal(await p.locator('.m-route').count(), 1);
    await p.focus('.m-btn[aria-label="Habitación 105"]');
    await p.keyboard.press('Enter');
    assert.equal(await p.locator('.m-btn.sel').getAttribute('aria-label'), 'Habitación 105');
    await p.context().close();
  });

  console.log('\n8. Consola');
  await caso('ningún error de JavaScript durante todos los flujos', async () => assert.deepEqual(errores, []));

  await navegador.close();
  servidor.close();
  const fallas = resultados.filter((r) => !r[0]).length;
  console.log(`\n${resultados.length - fallas}/${resultados.length} pruebas e2e pasaron`);
  process.exit(fallas ? 1 : 0);
})();
