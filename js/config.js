/**
 * Configuración global del portal.
 * Aquí solo van constantes de ajuste; el contenido vive en js/data/.
 */
const LOGO = 'assets/logo_vitae.png';

// ---- CONFIGURACIÓN DEL PORTAL ----
// modoPrueba: true  -> muestra la selección manual de sede como "temporal" y las notas internas para el equipo.
//             false -> cuando existan los QR: la sede llega por la URL (?sede=galery) y estas notas desaparecen.
const CONFIG = { modoPrueba: true };

/** Claves de localStorage (un solo lugar para no duplicar cadenas). */
const CLAVES = { sede: 'vitae_sede', vistos: 'vitae_vistos', a11y: 'vitae_a11y' };
