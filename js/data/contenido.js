// Info centralizada (igual para las 3 sedes) — tomada de los carteles físicos
const GLOBAL = {
  atencion: 'Todos los días, 6:30 a.m. – 8:00 p.m.',
  llave: [
    'En recepción te entregan la llave física al llegar.',
    'Debes dejarla en portería cada vez que salgas del hotel.',
    'Si la pierdes, avisa de inmediato en recepción.'
  ],
  tel_ruta: '3183874491',
  tel_reservas: '3150057053',
  correo_pqrf: 'hotelvitaepqrf@gmail.com',
  reglas: {
    normas: [
      'Mantenga la higiene y el orden en todos los espacios que utilice.',
      'Respete los horarios de alimentación y los horarios de programación de la ruta de transporte.',
      'El servicio se presta únicamente según las fechas autorizadas por su EPS. Sin autorización, el huésped debe pagar las noches de servicio.',
      'Al ingresar se le entregarán toallas que deberá devolver en recepción al salir.',
      'Cuide sus objetos personales; el hotel no se hace responsable de ellos.',
      'En caso de hospitalización, se realizará un cambio de habitación según condiciones pactadas con la EPS.'
    ],
    convivencia: [
      'Evite generar ruido después de las 8:00 p.m.',
      'Se prohíbe provocar desorden, vandalismo o alterar el orden y la tranquilidad.',
      'No se permite conducción sin recato ni reproducción de música a alto volumen.',
      'Prohibido actuar de forma grosera o agresiva contra huéspedes, acompañantes, visitantes o empleados.',
      'No se permiten actos de violencia, amenazas, acoso ni discriminación.',
      'No está permitido dejar solos a menores de edad (aviso a Policía de Menores y Bienestar Familiar en caso de incumplimiento).'
    ],
    instalaciones: [
      'No dañe ni deteriore instalaciones, bienes o suministros del hotel.',
      'Se prohíbe extraer elementos del hotel, incluidas sábanas, cobijas y toallas.',
      'No cuelgue ropa/calzado en las instalaciones, ni lave ropa en los baños.',
      'No se permite el ingreso de mascotas.',
      'Respete horarios y zonas comunes para recibir visitas. No se permite ingreso de acompañantes ocasionales menores de 18 años o no autorizados por la EPS.'
    ],
    sustancias: [
      'Prohibido fumar, cigarrillos electrónicos, bebidas alcohólicas, sustancias alucinógenas o cualquier droga dentro del hotel.',
      'No utilice servicios con costo adicional sin pagarlos antes.',
      'No hay menús personalizados; el menú disponible es el avalado por la EPS y el nutricionista.',
      'No se permite consumo de alimentos en las habitaciones, excepto por condiciones de salud que lo requieran.'
    ],
    seguridad: [
      'No está permitido ingresar armas de fuego, explosivos u otro tipo de arma. Su tenencia debe reportarse de inmediato.',
      'En caso de emergencia, siga las instrucciones del personal del hotel.',
      'El incumplimiento de estas normas puede generar sanciones, expulsión y/o reporte a las autoridades.'
    ]
  },
  transporte: {
    intro:
      'Servicio de transporte en ruta desde y hacia centros médicos, aeropuerto y terminal Salitre. Es colectivo (compartido con otros usuarios), no exclusivo ni personalizado.',
    reglas: [
      'Debe solicitarse con un (1) día de anticipación.',
      'Horario para solicitar: lunes a domingo de 7:00 a.m. a 5:00 p.m.',
      'El tiempo de espera del vehículo puede ser de hasta 2 horas, según lo definido por la EPS.',
      'El vehículo espera máximo 10 minutos en el punto de encuentro; si no te presentas, la ruta continúa sin afectar a los demás usuarios.',
      'No cubre trámites personales, autorizaciones, urgencias, ni recoger citas.',
      'Salida al aeropuerto: mínimo 3 horas antes. Cita médica: mínimo 2 horas antes.',
      'Transporte especial (sillas de ruedas, camillas): debe solicitarse directamente a la EPS con anticipación.',
      'El hotel no está obligado a cubrir Uber/taxi u otro transporte particular por fuera de estas condiciones.'
    ]
  },
  emergencias: {
    sismos: [
      'Conserve la calma',
      'Elimine fuente de incendio',
      'Retírese de ventanas y objetos que puedan caer',
      'No use elevadores',
      'Ubíquese en zonas de seguridad',
      'Localice la ruta de evacuación'
    ],
    incendios: [
      'Conserve la calma',
      'Identifique la fuente del incendio',
      'Emita la alarma',
      'Use el extintor',
      'Obedezca las indicaciones del personal capacitado',
      'Si hay humo, evite respirarlo y no retorne al lugar'
    ],
    evacuar: [
      'Antes de salir, verifique las rutas de evacuación y siga la señalizada hasta la salida más cercana',
      'Atienda las instrucciones del personal de seguridad',
      'Si hay humo, evacúe el área gateando',
      'Cierre las puertas al salir, sin seguro',
      'Evite correr y no se devuelva',
      'Suspenda las actividades y desconecte todo lo eléctrico',
      'Dé prioridad a las personas con mayor riesgo',
      'Si necesita refugio, deje señales'
    ],
    telefonos: [
      ['Hotel Vitae (celular principal)', '3183874491'],
      ['Emergencias', '123'],
      ['Bomberos', '119'],
      ['Defensa civil', '144'],
      ['Empresa de acueducto', '116'],
      ['Codensa', '115'],
      ['Policía nacional', '112'],
      ['Cruz Roja', '132'],
      ['Línea Púrpura de la mujer', '018000112137'],
      ['Línea para niños y adolescentes', '106']
    ]
  },
  esencia: {
    bienvenida: 'Le damos una cordial bienvenida al Hotel Vitae, un lugar donde su bienestar y comodidad son nuestra prioridad.',
    mision:
      'Brindar apoyo al enfermo y su familia en nuestros hoteles de salud, para que tengan estabilidad emocional frente a la enfermedad. Atención humanizada, procesos centrados en el paciente y su familia, con calidad, eficiencia y compromiso.',
    principios: ['Servicio', 'Integridad', 'Pasión', 'Disciplina'],
    derechos: [
      'A una comunicación plena y clara',
      'A la confidencialidad de sus documentos de salud',
      'A la información total y completa sobre los costos',
      'A recibir un trato digno y respetuoso',
      'A solicitar y sugerir mejoras en el servicio'
    ],
    deberes: [
      'Firmar el ingreso e identificarse sin ocultar información',
      'Respetar a los colaboradores del hotel',
      'Respetar la dignidad de otros usuarios y sus familiares',
      'Usar correctamente los recursos del hotel',
      'Hacerse responsable de los daños que genere el huésped o sus dependientes'
    ]
  }
};

const SE_PUEDE = [
  { q: 'Fumar o vapear', r: 'no', d: 'Está prohibido fumar y usar cigarrillos electrónicos dentro del hotel.' },
  { q: 'Alcohol o drogas', r: 'no', d: 'Prohibidas las bebidas alcohólicas, sustancias alucinógenas o cualquier droga dentro del hotel.' },
  { q: 'Traer mascotas', r: 'no', d: 'No se permite el ingreso de mascotas.' },
  { q: 'Hacer ruido en la noche', r: 'no', d: 'Evita el ruido después de las 8:00 p.m.' },
  { q: 'Poner música a alto volumen', r: 'no', d: 'No se permite reproducir música a alto volumen.' },
  { q: 'Comer en la habitación', r: 'cond', d: 'No, salvo que una condición de salud lo requiera.' },
  {
    q: 'Recibir visitas',
    r: 'cond',
    d: 'Solo en los horarios y zonas comunes. No entran acompañantes ocasionales menores de 18 años o no autorizados por la EPS.'
  },
  { q: 'Dejar solos a menores', r: 'no', d: 'No está permitido. Si ocurre, se avisa a Policía de Menores y a Bienestar Familiar.' },
  {
    q: 'Llevarme toallas o sábanas',
    r: 'no',
    d: 'No se puede sacar nada del hotel (sábanas, cobijas, toallas). Las toallas se devuelven en recepción al salir.'
  },
  { q: 'Lavar o colgar ropa', r: 'no', d: 'No cuelgues ropa ni calzado en las instalaciones, ni laves ropa en los baños.' },
  { q: 'Pedir un menú personalizado', r: 'no', d: 'No hay menús personalizados: el menú es el avalado por la EPS y el nutricionista.' },
  { q: 'Usar servicios con costo extra', r: 'cond', d: 'Solo si los pagas antes de usarlos.' },
  {
    q: 'Ingresar armas',
    r: 'no',
    d: 'No se permiten armas de fuego, explosivos ni otro tipo de arma. Si tienes una, repórtalo de inmediato.'
  },
  {
    q: 'Quedarme sin autorización EPS',
    r: 'cond',
    d: 'El servicio es solo en las fechas que autoriza tu EPS. Sin autorización, pagas las noches de servicio.'
  },
  { q: '¿Y si me hospitalizan?', r: 'info', d: 'Se hace un cambio de habitación según las condiciones pactadas con la EPS.' },
  { q: '¿Mis objetos personales?', r: 'info', d: 'Cuídalos: el hotel no se hace responsable de ellos.' }
];
const RQ_TXT = { no: '✕ No', cond: '! Con condición', info: 'i Bueno saber' };
