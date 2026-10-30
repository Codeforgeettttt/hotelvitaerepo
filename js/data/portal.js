// ---- DATOS ----
// wifi: real solo en Galery (tomado de cartel físico). Galerías y Corferias: PENDIENTE del cliente.
const SEDES = {
  s1: {
    slug: 'galery',
    nombre: 'Galery',
    direccion: 'Carrera 25 # 52-20',
    wifi: { red: 'Hotelvitae2024', clave: '255220*GA', real: true, qr: 'assets/wifi-galery.png' },
    contacto: { tel: '3183874491' }
  },
  s2: {
    slug: 'galerias',
    nombre: 'Galerías',
    direccion: 'Carrera 27a # 53-20',
    wifi: { red: 'Pendiente', clave: 'Pendiente', real: false },
    contacto: { tel: '3183874491' }
  },
  s3: {
    slug: 'corferias',
    nombre: 'Corferias',
    direccion: 'Av. Ferrocarril de Occidente # 43a-72',
    wifi: { red: 'Pendiente', clave: 'Pendiente', real: false },
    contacto: { tel: '3183874491' }
  }
};

// ---- SERVICIOS ADICIONALES (solo Galery, donde está el video de Bienestar) ----
// Pega aquí los enlaces cuando los tengas. Mientras estén vacíos, el portal muestra «Enlace pendiente».
const SERVICIOS = {
  marykay: {
    catalogo: 'https://www.marykay.com.co/es/icatalog',
    escaneo:
      'https://v4skinanalyzer.marykay.com.mx/V3H5/page/skinTestV4/entry.html?lang=es_MX&directSellerId=bzFuYXpqYXVZSUl2cFVVR2hMYWdzQT09&inviteId=53757&version_code=120',
    vendedora: 'Tatiana'
  }
};

// ---- AVISOS (un banner informativo a la vez, solo en el inicio) ----
// sedes: opcional, ids de SEDES donde aplica. destino: id de una sección del portal.
const AVISOS = [{ texto: '¿Necesitas transporte? Solicita tu ruta con un día de anticipación.', destino: 'traslados', cta: 'Ver cómo' }];

const ITEMS = [
  { id: 'wifi', ic: 'assets/icons/wifi.png', title: 'Wifi', sub: 'Red y contraseña' },
  { id: 'horarios', ic: 'assets/icons/comida.png', title: 'Alimentación', sub: 'Horarios de comida' },
  { id: 'traslados', ic: 'assets/icons/car.png', title: 'Traslados', sub: 'Cómo agendar tu ruta' },
  { id: 'llave', ic: 'assets/icons/check-in.png', title: 'Check-in / Llave', sub: 'Instrucciones de acceso' },
  { id: 'reglas', ic: 'assets/icons/reglas.png', title: 'Reglas', sub: 'Derechos y deberes' },
  { id: 'emergencias', ic: 'assets/icons/emergency.png', title: 'Emergencias', sub: 'Sismos, incendios, teléfonos' },
  { id: 'contacto', ic: 'assets/icons/contact-us.png', title: 'Contacto', sub: 'Ruta, reservas y PQRF' },
  { id: 'videos', ic: 'assets/icons/guide.png', title: 'Videos', sub: 'Cómo funciona tu estadía' },
  { id: 'guia', ic: 'assets/icons/guide.png', title: 'Guía del huésped', sub: 'Nuestra esencia y tus derechos' },
  { id: 'servicios', ic: 'assets/icons/servicios.svg', title: 'Servicios adicionales', sub: 'Mary Kay y bienestar', sedes: ['s1'] },
  { id: 'mapa', ic: 'assets/icons/emergency.png', title: 'Mapa de evacuación', sub: 'Tu ruta de salida', sedes: ['s1'], oculto: true }
];
