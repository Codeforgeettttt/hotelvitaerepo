#!/usr/bin/env node
/**
 * Servidor estático mínimo (sin dependencias) para ver el portal en local o para las pruebas e2e.
 * Uso: node scripts/servir.js [puerto]   (por defecto 8080)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8'
};

function crearServidor() {
  return http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const archivo = path.normalize(path.join(RAIZ, url === '/' ? 'index.html' : url));
    if (!archivo.startsWith(RAIZ)) {
      res.writeHead(403).end();
      return;
    } // evita salir de la carpeta del proyecto
    fs.readFile(archivo, (err, datos) => {
      if (err) {
        res.writeHead(404).end('No encontrado');
        return;
      }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
      res.end(datos);
    });
  });
}

if (require.main === module) {
  const puerto = Number(process.argv[2]) || 8080;
  crearServidor().listen(puerto, () => console.log('Portal en http://localhost:' + puerto));
}
module.exports = { crearServidor };
