# Portal del Huésped — Hotel Vitae (v1)

Prototipo de la nueva sección enfocada en el huésped que ya está hospedado: acceso a wifi, instrucciones de llave, reglas, traslados, horarios de comida, contacto y guía general. Pensado para abrirse desde un QR en la habitación, un link enviado por WhatsApp al check-in, o un botón en la web.

## Cómo verlo

Abre `index.html` con doble clic. No necesita servidor ni internet (excepto para cargar la tipografía Archivo/Lora desde Google Fonts).

## Estructura de archivos

```
hotel-vitae-portal/
├── index.html              → estructura del portal
├── css/
│   └── style.css           → estilos (paleta y tipografía de Hotel Vitae)
├── js/
│   └── script.js           → lógica: selector de sede, contenido de cada panel
├── assets/
│   ├── logo_vitae.png      → logo real del hotel
│   └── icons/              → los 8 íconos del dashboard (wifi, llave, reglas,
│                              traslados, comida, emergencias, contacto, guía)
└── referencia/
    └── base-estilo-hero.html → mockup del header + hero de la web actual,
                                  usado para validar que la paleta/tipografía
                                  coincidieran antes de construir el portal
```

## Cómo funciona

1. **Selector de sede**: el huésped elige entre Galery, Galerías o Corferias. En producción esto se saltaría solo, porque cada sede tendría su propio QR/link.
2. **Dashboard**: 7 accesos en forma de tarjeta (Wifi, Check-in/Llave, Reglas, Traslados, Alimentación, Contacto, Guía del huésped).
3. **Contenido por sede vs. centralizado**: Wifi y check-in/llave cambian según la sede. Reglas, traslados, horarios de alimentación, emergencias y contacto son iguales para las tres (tomado de los carteles físicos del hotel).
4. **Emergencias** (nuevo): protocolo de sismos e incendios y teléfonos de emergencia, tomado de los carteles físicos.
5. **Guía del huésped**: bienvenida institucional (misión y principios) + enlaces a los demás accesos + datos de la sede.

## Qué es real y qué es dato de ejemplo (placeholder)

Todo vive en `js/script.js`, dentro de los objetos `SEDES` y `GLOBAL`, para que sea fácil de ubicar y editar.

| Dato | Estado |
|---|---|
| Nombres y direcciones de las 3 sedes | ✅ Real |
| Horario de atención por sede | ✅ Real |
| Wifi Sede Galery (red/clave) | ✅ Real: Hotelvitae2024 / 255220*GA |
| Wifi Sede Galerías y Corferias | 🟡 Pendiente — cada sede tiene red propia, falta el dato |
| Horarios de alimentación | ✅ Real (incluye desayuno para llevar y horario de domingos/festivos) |
| Reglas (derechos y deberes) | ✅ Real, texto completo de la Carta de Derechos y Deberes |
| Reglas del servicio de transporte | ✅ Real, pero hay una inconsistencia entre carteles sobre el horario de agendamiento (7am–5pm vs 6am–5pm) — confirmar con el cliente |
| Emergencias (sismos/teléfonos) | ✅ Real |
| Emergencias (pasos de incendio) | 🟡 Real pero incompleto — la foto del cartel corta los pasos 7 a 9 |
| Teléfonos: ruta, reservas, PQRF | ✅ Real (3183874491 / 3150057053 / hotelvitaepqrf@gmail.com) |
| Instrucciones de llave/check-in | 🟡 Placeholder — no había cartel de esto, falta redactar con el cliente |
| QR de wifi | 🟡 Genérico de ejemplo, no funcional |
| Íconos del dashboard (wifi, llave, reglas, etc.) | ✅ Reales, provistos por el cliente, en `assets/icons/` |
| Dirección Corferias | ⚠️ Se dejó la de la web (Av. Ferrocarril de Occidente # 43a-72); el cartel físico decía "AC 22 # 43A-72" — el cliente confirmó usar la de la web |

## Cómo editar el contenido

Todos los textos de cada panel están en `js/script.js`. Para cambiar, por ejemplo, la contraseña de wifi de una sede:

```js
s1: { nombre:"Galery", ...
      wifi:{red:"VitaeGalery", clave:"vitae2026"},   // <- editar aquí
```

Para cambiar colores o tipografía, todo está centralizado en las variables al inicio de `css/style.css` (`:root { --p: ... }`).

## Siguientes pasos sugeridos

- Confirmar con el cliente los datos pendientes (tabla de arriba).
- Reemplazar el QR genérico por el QR real de wifi de cada sede.
- Decidir el canal de acceso definitivo (QR físico, link por WhatsApp, botón en la web, o los tres).
- Una vez aprobado el contenido, integrarlo como sección de la web real (hotelvitae.com).
