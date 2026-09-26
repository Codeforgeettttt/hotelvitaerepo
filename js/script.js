const LOGO = "assets/logo_vitae.png";
document.getElementById('logoImg').src = LOGO;

// ---- DATOS (placeholder — reemplazar con info real por sede) ----
const SEDES = {
  s1: { nombre:"Galery", direccion:"Carrera 25 # 52-20", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"VitaeGalery", clave:"vitae2026"},
        llave:["En recepción te entregan la llave física al llegar.","Debes dejarla en portería cada vez que salgas del hotel.","Si la pierdes, avisa de inmediato al contacto de esta sede."],
        reglas:["Silencio después de las 9:00 p.m.","No se permiten visitas en habitaciones.","Registrar entrada y salida en portería."],
        contacto:{tel:"+57 318 387 4491"} },
  s2: { nombre:"Galerías", direccion:"Carrera 27a # 53-20", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"VitaeGalerias", clave:"vitae2026"},
        llave:["La llave se recoge con el personal de turno al llegar.","Debe devolverse al salir del edificio.","Pérdida: reportar al contacto de esta sede."],
        reglas:["Silencio después de las 9:00 p.m.","No se permiten visitas en habitaciones.","Registrar entrada y salida en portería."],
        contacto:{tel:"+57 318 387 4491"} },
  s3: { nombre:"Corferias", direccion:"Av. Ferrocarril de Occidente # 43a-72", atencion:"Todos los días, 6:30 a.m. – 8:00 p.m.",
        wifi:{red:"VitaeCorferias", clave:"vitae2026"},
        llave:["Recepción entrega la llave física al ingreso.","Se deja en portería al salir.","Pérdida: reportar al contacto de esta sede."],
        reglas:["Silencio después de las 9:00 p.m.","No se permiten visitas en habitaciones.","Registrar entrada y salida en portería."],
        contacto:{tel:"+57 318 387 4491"} }
};
// Info centralizada, igual para todas las sedes
const GLOBAL = {
  traslados_tel:"+57 318 387 4491",
  horarios:[["Desayuno","6:30 – 8:30 a.m."],["Almuerzo","12:00 – 2:00 p.m."],["Cena","6:30 – 8:00 p.m."]]
};

let currentSede = null;

function buildSedeSelector(){
  const list = document.getElementById('sedeList');
  list.innerHTML = Object.entries(SEDES).map(([id,s]) =>
    `<button class="sede-btn" onclick="selectSede('${id}')"><b>${s.nombre}</b><small>${s.direccion}</small><small>${s.atencion}</small></button>`
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
  {id:'wifi', ic:'📶', title:'Wifi', sub:'Red y contraseña'},
  {id:'llave', ic:'🔑', title:'Check-in / Llave', sub:'Instrucciones de acceso'},
  {id:'reglas', ic:'📋', title:'Reglas', sub:'Normas del hotel'},
  {id:'traslados', ic:'🚗', title:'Traslados', sub:'Coordinar cita'},
  {id:'horarios', ic:'🍽️', title:'Alimentación', sub:'Horarios de comida'},
  {id:'contacto', ic:'💬', title:'Contacto', sub:'Reportar una necesidad'},
  {id:'guia', ic:'📄', title:'Guía del huésped', sub:'Todo en un solo lugar'}
];

function buildGrid(){
  document.getElementById('grid').innerHTML = ITEMS.map(it =>
    `<button class="card" onclick="openDetail('${it.id}')">
      <div class="ic">${it.ic}</div><b>${it.title}</b><small>${it.sub}</small>
    </button>`).join('');
}

function showDashboard(){
  document.getElementById('panel-selector').classList.remove('active');
  document.getElementById('panel-detail').classList.remove('active');
  document.getElementById('panel-dashboard').classList.add('active');
}

function openDetail(id){
  const s = SEDES[currentSede];
  const c = document.getElementById('detailContent');
  let html = '';
  if(id==='wifi'){
    html = `<h2>📶 Wifi <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box" style="text-align:center;">
      <div class="qr-placeholder"></div>
      <p class="note">QR genérico de ejemplo — se reemplaza por el QR real de wifi de esta sede</p>
      <div class="kv"><b>Red</b><span>${s.wifi.red}</span></div>
      <div class="kv"><b>Contraseña</b><span>${s.wifi.clave}</span></div>
    </div>`;
  } else if(id==='llave'){
    html = `<h2>🔑 Check-in / Llave <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box"><ol>${s.llave.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
  } else if(id==='reglas'){
    html = `<h2>📋 Reglas del hotel <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box"><ul>${s.reglas.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
  } else if(id==='traslados'){
    html = `<h2>🚗 Traslados <span class="tag-global">Centralizado</span></h2>
    <div class="box"><p style="color:var(--txt2);line-height:1.6;">Coordina la recogida para tus citas médicas escribiendo al número de traslados. Indica hora y dirección del centro médico.</p>
    <a class="cta" href="https://wa.me/${GLOBAL.traslados_tel.replace(/\D/g,'')}" target="_blank">Coordinar por WhatsApp — ${GLOBAL.traslados_tel}</a></div>`;
  } else if(id==='horarios'){
    html = `<h2>🍽️ Horarios de alimentación <span class="tag-global">Centralizado</span></h2>
    <div class="box">${GLOBAL.horarios.map(h=>`<div class="kv"><b>${h[0]}</b><span>${h[1]}</span></div>`).join('')}</div>`;
  } else if(id==='contacto'){
    html = `<h2>💬 Contacto <span class="tag-global">Sede: ${s.nombre}</span></h2>
    <div class="box"><p style="color:var(--txt2);line-height:1.6;">¿Algo no funciona o necesitas algo durante tu estadía? Escríbenos directo.</p>
    <a class="cta" href="https://wa.me/${s.contacto.tel.replace(/\D/g,'')}" target="_blank">Escribir por WhatsApp — ${s.contacto.tel}</a></div>`;
  } else if(id==='guia'){
    html = `<h2>📄 Guía del huésped</h2>
    <div class="box">
      <p style="color:var(--txt2);line-height:1.6;">Resumen de tu estadía en <b>${s.nombre}</b>. Toca cualquier punto para ver el detalle.</p>
      ${ITEMS.filter(i=>i.id!=='guia').map(i=>`<a class="idx-link" href="#" onclick="openDetail('${i.id}');return false;">${i.ic} ${i.title}</a>`).join('')}
    </div>
    <div class="box">
      <b style="display:block;margin-bottom:8px;">Otros datos útiles</b>
      <ul>
        <li>Zona: ${s.direccion} — a poca distancia de centros médicos de la zona.</li>
        <li>Emergencia médica: dirígete a Urgencias del centro donde tienes tu tratamiento y avisa por WhatsApp a Contacto.</li>
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
