/**
 * Arranque del portal: conecta eventos, aplica preferencias y decide la pantalla inicial.
 * Es el único archivo que toca el DOM al cargar; el resto solo define funciones y datos.
 */
$('logoImg').src = LOGO;
conectarEventos();

// Reproductor de video: al cerrar se vacía (detiene la descarga) y un clic fuera lo cierra.
$('vmodal').addEventListener('close', () => {
  $('vmMedia').innerHTML = '';
  vActual = null;
});
$('vmodal').addEventListener('click', (e) => {
  if (e.target === $('vmodal')) closeVideo();
});

// Diálogo de accesibilidad: clic fuera para cerrar.
$('a11yDlg').addEventListener('click', (e) => {
  if (e.target === $('a11yDlg')) $('a11yDlg').close();
});
aplicarA11y();

// «Ahora / Siguiente» del comedor: se refresca cada 30 s, y no mientras la pestaña está oculta.
const INTERVALO_COMIDA_MS = 30000;
setInterval(() => {
  if (!document.hidden) actualizarComidaEnVivo();
}, INTERVALO_COMIDA_MS);

buildSedeSelector();
iniciarPortal();
