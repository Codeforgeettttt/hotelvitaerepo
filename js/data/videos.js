/** Biblioteca de videos y sus categorías. Para un video nuevo, agrega una línea a VIDEOS. */
// ---- VIDEOS INFORMATIVOS ----
// Por convención, el video vN usa assets/videos/video-NN.mp4 y assets/posters/video-NN.jpg (ver el final de este archivo).
// dur: duración mostrada en la tarjeta; se corrige sola con la real al cargar la miniatura.
// Alternativas por video: yt:'ID_DE_YOUTUBE'  |  poster:'assets/videos/portada.jpg'
// sedes: si existe, el video solo aparece en esas sedes (ids de SEDES: s1 = Galery)
// secciones: secciones del portal donde ese video también aparece
const VIDEOS = [
  {
    id: 'v1',
    dur: '1:20',
    inicio: true,
    cat: 'llegada',
    title: 'Bienvenida, horarios y reglas',
    tab: 'Bienvenida',
    desc: 'Lo primero que debes saber para comenzar tu estadía.',
    secciones: ['reglas']
  },
  {
    id: 'v2',
    dur: '1:18',
    inicio: true,
    cat: 'llegada',
    title: 'Ingreso, documentos y registro',
    tab: 'Ingreso',
    desc: 'Cómo es el ingreso, qué documentos necesitas y cómo te registras.',
    secciones: ['llave']
  },
  {
    id: 'v3',
    dur: '1:35',
    inicio: true,
    cat: 'estadia',
    title: 'Horarios, comedor y lavandería',
    tab: 'Comedor',
    desc: 'Horarios de comida y cómo usar el comedor y la lavandería.',
    secciones: ['horarios']
  },
  {
    id: 'v4',
    dur: '1:21',
    cat: 'convivencia',
    title: 'Convivencia y prohibiciones',
    tab: 'Convivencia',
    desc: 'Cómo convivir bien con los demás y qué no está permitido.',
    secciones: ['reglas']
  },
  {
    id: 'v5',
    dur: '0:53',
    cat: 'estadia',
    title: 'Tu habitación, aseo y cuidado',
    tab: 'Habitación',
    desc: 'Cómo cuidar y mantener tu habitación.',
    secciones: ['reglas']
  },
  {
    id: 'v6',
    dur: '0:50',
    cat: 'convivencia',
    title: 'Salud, menores y visitas',
    tab: 'Salud y visitas',
    desc: 'Lo que debes saber sobre salud, menores de edad y visitas.',
    secciones: ['reglas']
  },
  {
    id: 'v7',
    dur: '1:10',
    cat: 'estadia',
    title: 'Transporte',
    tab: 'Transporte',
    desc: 'Cómo funciona el transporte, cómo solicitarlo y sus reglas.',
    secciones: ['traslados']
  },
  {
    id: 'v8',
    dur: '1:00',
    cat: 'ayuda',
    title: 'PQRS',
    tab: 'PQRS',
    desc: 'Cómo hacer una petición, queja, reclamo o sugerencia.',
    secciones: ['contacto']
  },
  {
    id: 'v9',
    dur: '0:40',
    inicio: true,
    cat: 'ayuda',
    title: 'Seguridad: sismos, incendios y evacuación',
    tab: 'Seguridad',
    desc: 'Qué hacer en caso de sismo, incendio o evacuación.',
    secciones: ['emergencias']
  },
  {
    id: 'v10',
    dur: '0:48',
    cat: 'ayuda',
    title: 'Salida, emergencias, sedes y servicios',
    tab: 'Salida y sedes',
    desc: 'Cómo es tu salida, qué hacer en emergencias y qué servicios tienes.',
    secciones: ['emergencias']
  },
  {
    id: 'v11',
    dur: '0:10',
    cat: 'estadia',
    title: 'Bienestar',
    tab: 'Bienestar',
    desc: 'Contenido de bienestar disponible solo en la sede Galery.',
    sedes: ['s1'],
    secciones: ['servicios']
  }
];

// ---- CATEGORÍAS DE VIDEO (derivadas de los 11 videos existentes) ----
const CATEGORIAS = [
  { id: 'llegada', titulo: 'Llegada y bienvenida', sub: 'Lo primero que necesitas saber' },
  { id: 'estadia', titulo: 'Tu estadía día a día', sub: 'Comedor, habitación, transporte y bienestar' },
  { id: 'convivencia', titulo: 'Convivencia y normas', sub: 'Para que todos estemos cómodos' },
  { id: 'ayuda', titulo: 'Seguridad, salida y ayuda', sub: 'Emergencias, PQRS y despedida' }
];

/** Completa las rutas por convención a partir del id, salvo que el video traiga mp4, yt o poster propios. */
VIDEOS.forEach((v) => {
  const nn = pad2(parseInt(v.id.slice(1), 10));
  if (!v.mp4 && !v.yt) v.mp4 = 'assets/videos/video-' + nn + '.mp4';
  if (!v.poster) v.poster = 'assets/posters/video-' + nn + '.jpg';
});
