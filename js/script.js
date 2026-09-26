const LOGO = "assets/logo_vitae.png";
document.getElementById('logoImg').src = LOGO;

// ---- DATOS ----
// wifi: real solo en Galery (tomado de cartel físico). Galerías y Corferias: PENDIENTE del cliente.
const SEDES = {
  s1: { nombre:"Galery", direccion:"Carrera 25 # 52-20", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"Hotelvitae2024", clave:"255220*GA", real:true},
        llave:["En recepción te entregan la llave física al llegar.","Debes dejarla en portería cada vez que salgas del hotel.","Si la pierdes, avisa de inmediato al contacto de esta sede."],
        contacto:{tel:"3183874491"} },
  s2: { nombre:"Galerías", direccion:"Carrera 27a # 53-20", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"Pendiente", clave:"Pendiente", real:false},
        llave:["La llave se recoge con el personal de turno al llegar.","Debe devolverse al salir del edificio.","Pérdida: reportar al contacto de esta sede."],
        contacto:{tel:"3183874491"} },
  s3: { nombre:"Corferias", direccion:"Av. Ferrocarril de Occidente # 43a-72", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"Pendiente", clave:"Pendiente", real:false},
        llave:["Recepción entrega la llave física al ingreso.","Se deja en portería al salir.","Pérdida: reportar al contacto de esta sede."],
        contacto:{tel:"3183874491"} }
};

// Info centralizada (igual para las 3 sedes) — tomada de los carteles físicos
const GLOBAL = {
  tel_ruta:"3183874491",
  tel_reservas:"3150057053",
  correo_pqrf:"hotelvitaepqrf@gmail.com",
  horarios:[
    ["Desayuno para llevar","5:00 – 7:00 a.m."],
    ["Desayuno","7:00 – 8:00 a.m."],
    ["Almuerzo","12:00 – 2:00 p.m."],
    ["Cena","5:00 – 6:00 p.m."],
    ["Domingos y festivos (desayuno)","8:00 – 9:00 a.m."]
  ],
  reglas:{
    normas:["Mantenga la higiene y el orden en todos los espacios que utilice.","Respete los horarios de alimentación y los horarios de programación de la ruta de transporte.","El servicio se presta únicamente según las fechas autorizadas por su EPS. Sin autorización, el huésped debe pagar las noches de servicio.","Al ingresar se le entregarán toallas que deberá devolver en recepción al salir.","Cuide sus objetos personales; el hotel no se hace responsable de ellos.","En caso de hospitalización, se realizará un cambio de habitación según condiciones pactadas con la EPS."],
    convivencia:["Evite generar ruido después de las 8:00 p.m.","Se prohíbe provocar desorden, vandalismo o alterar el orden y la tranquilidad.","No se permite conducción sin recato ni reproducción de música a alto volumen.","Prohibido actuar de forma grosera o agresiva contra huéspedes, acompañantes, visitantes o empleados.","No se permiten actos de violencia, amenazas, acoso ni discriminación.","No está permitido dejar solos a menores de edad (aviso a Policía de Menores y Bienestar Familiar en caso de incumplimiento)."],
    instalaciones:["No dañe ni deteriore instalaciones, bienes o suministros del hotel.","Se prohíbe extraer elementos del hotel, incluidas sábanas, cobijas y toallas.","No cuelgue ropa/calzado en las instalaciones, ni lave ropa en los baños.","No se permite el ingreso de mascotas.","Respete horarios y zonas comunes para recibir visitas. No se permite ingreso de acompañantes ocasionales menores de 18 años o no autorizados por la EPS."],
    sustancias:["Prohibido fumar, cigarrillos electrónicos, bebidas alcohólicas, sustancias alucinógenas o cualquier droga dentro del hotel.","No utilice servicios con costo adicional sin pagarlos antes.","No hay menús personalizados; el menú disponible es el avalado por la EPS y el nutricionista.","No se permite consumo de alimentos en las habitaciones, excepto por condiciones de salud que lo requieran."],
    seguridad:["No está permitido ingresar armas de fuego, explosivos u otro tipo de arma. Su tenencia debe reportarse de inmediato.","En caso de emergencia, siga las instrucciones del personal del hotel.","El incumplimiento de estas normas puede generar sanciones, expulsión y/o reporte a las autoridades."]
  },
  transporte:{
    intro:"Servicio de transporte en ruta desde y hacia centros médicos, aeropuerto y terminal Salitre. Es colectivo (compartido con otros usuarios), no exclusivo ni personalizado.",
    reglas:["Debe solicitarse con un (1) día de anticipación.","Horario para solicitar: lunes a domingo de 6:00 a.m. a 5:00 p.m.","El tiempo de espera del vehículo puede ser de hasta 2 horas, según lo definido por la EPS.","El vehículo espera máximo 10 minutos en el punto de encuentro; si no te presentas, la ruta continúa sin afectar a los demás usuarios.","No cubre trámites personales, autorizaciones, urgencias, ni recoger citas.","Salida al aeropuerto: mínimo 3 horas antes. Cita médica: mínimo 2 horas antes.","Transporte especial (sillas de ruedas, camillas): debe solicitarse directamente a la EPS con anticipación.","El hotel no está obligado a cubrir Uber/taxi u otro transporte particular por fuera de estas condiciones."],
    nota:"* Un cartel indica horario de agendamiento 7:00 a.m.–5:00 p.m. y otro 6:00 a.m.–5:00 p.m. — confirmar con el cliente cuál es el vigente."
  },
  emergencias:{
    sismos:["Conserve la calma","Elimine fuente de incendio","Retírese de ventanas y objetos que puedan caer","No use elevadores","Ubíquese en zonas de seguridad","Localice la ruta de evacuación"],
    incendios:["Conserve la calma","Identifique la fuente del incendio","Emita la alarma","Use el extintor","Obedezca las indicaciones del personal capacitado","Si hay humo, evite respirarlo y no retorne al lugar"],
    telefonos:[["Hotel Vitae (celular principal)","3183874491"],["Emergencias","123"],["Bomberos","119"],["Defensa civil","144"],["Empresa de acueducto","116"],["Codensa","115"],["Policía nacional","112"],["Cruz Roja","132"],["Línea Púrpura de la mujer","018000112137"],["Línea para niños y adolescentes","106"]],
    nota:"* Los pasos de incendios se tomaron de un cartel parcialmente cubierto en la foto — confirmar los pasos 7 a 9 con el cliente."
  },
  esencia:{
    bienvenida:"Le damos una cordial bienvenida al Hotel Vitae, un lugar donde su bienestar y comodidad son nuestra prioridad.",
    mision:"Brindar apoyo al enfermo y su familia en nuestros hoteles de salud, para que tengan estabilidad emocional frente a la enfermedad. Atención humanizada, procesos centrados en el paciente y su familia, con calidad, eficiencia y compromiso.",
    principios:["Servicio","Integridad","Pasión","Disciplina"],
    derechos:["A una comunicación plena y clara","A la confidencialidad de sus documentos de salud","A la información total y completa sobre los costos","A recibir un trato digno y respetuoso","A solicitar y sugerir mejoras en el servicio"],
    deberes:["Firmar el ingreso e identificarse sin ocultar información","Respetar a los colaboradores del hotel","Respetar la dignidad de otros usuarios y sus familiares","Usar correctamente los recursos del hotel","Hacerse responsable de los daños que genere el huésped o sus dependientes"]
  }
};

let currentSede = null;

function buildSedeSelector(){
  const pinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
  const clockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
  const list = document.getElementById('sedeList');
  list.innerHTML = Object.entries(SEDES).map(([id,s]) =>
    `<button class="sede-btn" onclick="selectSede('${id}')">
      <b>${s.nombre}</b>
      <div class="sede-row">${pinIcon}<span>${s.direccion}</span></div>
      <div class="sede-row">${clockIcon}<span>${s.atencion}</span></div>
    </button>`
  ).join('');
}

function selectSede(id){
  currentSede = id;
  const s = SEDES[id];
  document.getElementById('sedeTag').style.display='inline-block';
  document.getElementById('sedeTag').textContent = s.nombre;
  showDashboard();
}

const ITEMS = [
  {id:'wifi', ic:'assets/icons/wifi.png', title:'Wifi', sub:'Red y contraseña'},
  {id:'llave', ic:'assets/icons/check-in.png', title:'Check-in / Llave', sub:'Instrucciones de acceso'},
  {id:'reglas', ic:'assets/icons/reglas.png', title:'Reglas', sub:'Derechos y deberes'},
  {id:'traslados', ic:'assets/icons/car.png', title:'Traslados', sub:'Cómo agendar tu ruta'},
  {id:'horarios', ic:'assets/icons/comida.png', title:'Alimentación', sub:'Horarios de comida'},
  {id:'emergencias', ic:'assets/icons/emergency.png', title:'Emergencias', sub:'Sismos, incendios, teléfonos'},
  {id:'contacto', ic:'assets/icons/contact-us.png', title:'Contacto', sub:'Ruta, reservas y PQRF'},
  {id:'guia', ic:'assets/icons/guide.png', title:'Guía del huésped', sub:'Todo en un solo lugar'}
];

function buildGrid(){
  document.getElementById('grid').innerHTML = ITEMS.map(it =>
    `<button class="card" onclick="openDetail('${it.id}')">
      <div class="ic"><img src="${it.ic}" alt=""></div><b>${it.title}</b><small>${it.sub}</small>
    </button>`).join('');
}

function showDashboard(){
  document.getElementById('panel-selector').classList.remove('active');
  document.getElementById('panel-detail').classList.remove('active');
  document.getElementById('panel-dashboard').classList.add('active');
}

function waLink(tel, texto){
  return `https://wa.me/57${tel}?text=${encodeURIComponent(texto)}`;
}

function openDetail(id){
  const s = SEDES[currentSede];
  const c = document.getElementById('detailContent');
  let html = '';
  if(id==='wifi'){
    html = `<h2><img class="h2-ic" src="assets/icons/wifi.png"> Wifi <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box" style="text-align:center;">
      <div class="qr-placeholder"></div>
      <p class="note">${s.wifi.real ? 'QR de ejemplo — reemplazar por el QR real de esta red' : 'Dato pendiente: falta la red/clave real de esta sede'}</p>
      <div class="kv"><b>Red</b><span>${s.wifi.red}</span></div>
      <div class="kv"><b>Contraseña</b><span>${s.wifi.clave}</span></div>
    </div>`;
  } else if(id==='llave'){
    html = `<h2><img class="h2-ic" src="assets/icons/check-in.png"> Check-in / Llave <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box"><ol>${s.llave.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
  } else if(id==='reglas'){
    const R = GLOBAL.reglas;
    html = `<h2><img class="h2-ic" src="assets/icons/reglas.png"> Derechos y deberes <span class="tag-global">Todas las sedes</span></h2>
    <div class="box"><b style="display:block;margin-bottom:8px;">1. Normas generales</b><ul>${R.normas.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">2. Convivencia y comportamiento</b><ul>${R.convivencia.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">3. Uso de instalaciones y bienes</b><ul>${R.instalaciones.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">4. Consumo de sustancias y uso de servicios</b><ul>${R.sustancias.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">5. Seguridad</b><ul>${R.seguridad.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
  } else if(id==='traslados'){
    const T = GLOBAL.transporte;
    html = `<h2><img class="h2-ic" src="assets/icons/car.png"> Traslados <span class="tag-global">Centralizado</span></h2>
    <div class="box"><p style="color:var(--txt2);line-height:1.6;">${T.intro}</p></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">Cómo funciona</b><ul>${T.reglas.map(x=>`<li>${x}</li>`).join('')}</ul>
    <p class="note" style="text-align:left;margin-top:10px;">${T.nota}</p></div>
    <a class="cta" href="${waLink(GLOBAL.tel_ruta,'Hola, quiero agendar mi ruta de transporte')}" target="_blank">Agendar por WhatsApp — ${GLOBAL.tel_ruta}</a>`;
  } else if(id==='horarios'){
    html = `<h2><img class="h2-ic" src="assets/icons/comida.png"> Horarios de alimentación <span class="tag-global">Centralizado</span></h2>
    <div class="box">${GLOBAL.horarios.map(h=>`<div class="kv"><b>${h[0]}</b><span>${h[1]}</span></div>`).join('')}</div>`;
  } else if(id==='emergencias'){
    const E = GLOBAL.emergencias;
    html = `<h2><img class="h2-ic" src="assets/icons/emergency.png"> Emergencias <span class="tag-global">Todas las sedes</span></h2>
    <div class="box"><b style="display:block;margin-bottom:8px;">¿Qué hacer en un sismo?</b><ol>${E.sismos.map(x=>`<li>${x}</li>`).join('')}</ol></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">¿Qué hacer en un incendio?</b><ol>${E.incendios.map(x=>`<li>${x}</li>`).join('')}</ol>
    <p class="note" style="text-align:left;margin-top:8px;">${E.nota}</p></div>
    <div class="box"><b style="display:block;margin-bottom:8px;">Teléfonos de emergencia</b>${E.telefonos.map(t=>`<div class="kv"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>`;
  } else if(id==='contacto'){
    html = `<h2><img class="h2-ic" src="assets/icons/contact-us.png"> Contacto <span class="tag-global">Todas las sedes</span></h2>

    <div class="box">
      <div class="kv"><b>Ruta / transporte</b><span>${GLOBAL.tel_ruta}</span></div>
      <a class="cta" style="margin-top:10px;display:inline-block;" href="${waLink(GLOBAL.tel_ruta,'Hola, quiero agendar mi ruta de transporte')}" target="_blank">Escribir a Ruta por WhatsApp</a>
    </div>

    <div class="box">
      <div class="kv"><b>Reservas</b><span>${GLOBAL.tel_reservas}</span></div>
      <a class="cta" style="margin-top:10px;display:inline-block;" href="${waLink(GLOBAL.tel_reservas,'Hola, quiero información sobre reservas')}" target="_blank">Escribir a Reservas por WhatsApp</a>
    </div>

    <div class="box">
      <div class="kv"><b>PQRF (quejas/reclamos)</b><span>${GLOBAL.correo_pqrf}</span></div>
      <a class="cta" style="margin-top:10px;display:inline-block;" href="mailto:${GLOBAL.correo_pqrf}?subject=${encodeURIComponent('PQRF Hotel Vitae - '+s.nombre)}">Escribir al correo PQRF</a>
    </div>`;
  } else if(id==='guia'){
    const Es = GLOBAL.esencia;
    html = `<h2><img class="h2-ic" src="assets/icons/guide.png"> Guía del huésped</h2>
    <div class="box">
      <p style="color:var(--txt2);line-height:1.6;">${Es.bienvenida}</p>
      <p style="color:var(--txt2);line-height:1.6;"><b>Nuestra misión:</b> ${Es.mision}</p>
      <p style="color:var(--txt2);"><b>Principios:</b> ${Es.principios.join(' · ')}</p>
    </div>
    <div class="box"><b style="display:block;margin-bottom:8px;">Accesos rápidos</b>
      ${ITEMS.filter(i=>i.id!=='guia').map(i=>`<a class="idx-link" href="#" onclick="openDetail('${i.id}');return false;">${i.ic} ${i.title}</a>`).join('')}
    </div>
    <div class="box">
      <b style="display:block;margin-bottom:8px;">Otros datos útiles</b>
      <ul>
        <li>Sede: ${s.nombre} — ${s.direccion}</li>
        <li>Check-out: coordina la hora con recepción el día anterior.</li>
      </ul>
    </div>`;
  }
  c.innerHTML = html;
  document.getElementById('panel-dashboard').classList.remove('active');
  document.getElementById('panel-detail').classList.add('active');
}

buildSedeSelector();
buildGrid();