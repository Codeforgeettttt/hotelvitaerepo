/**
 * Plano del primer piso de la sede Galery, en coordenadas del SVG (viewBox 60 160 1140 710).
 * Para otra sede con plano: crear un archivo equivalente y habilitar el mapa en su ITEMS.sedes.
 * MAPA_HAB: r = rectángulo [x1,y1,x2,y2]; d = puerta [x,y]; w = salida por defecto (o|e|s).
 * MAPA_EXITS: pt = punto de salida; pe = punto de encuentro.
 */
const C_Y = 688; // eje del pasillo
// puerta de cada habitación: [x, y] sobre el borde, luego se baja/sube al pasillo
const MAPA_HAB = {
  104: { r: [1000, 720, 1110, 850], d: [1050, 720], w: 'e' },
  105: { r: [845, 720, 945, 850], d: [895, 720], w: 'e' },
  106: { r: [735, 720, 845, 850], d: [790, 720], w: 'o' },
  107: { r: [625, 720, 735, 850], d: [680, 720], w: 'o' },
  108: { r: [445, 720, 565, 850], d: [505, 720], w: 'o' },
  109: { r: [445, 530, 610, 655], d: [560, 655], w: 'o' },
  110: { r: [715, 530, 835, 655], d: [775, 655], w: 's' },
  rec: { r: [160, 580, 300, 770], d: [230, 688], w: 'o', nombre: 'Recepción' }
};
const MAPA_EXITS = {
  o: { nombre: 'Carrera 24 (oeste)', pt: [165, 650], pe: [90, 620] },
  e: { nombre: 'Salida este', pt: [1110, C_Y], pe: [1145, C_Y] },
  s: { nombre: 'Salida Sala de estar', pt: [1110, 375], pe: [1145, 375] }
};
