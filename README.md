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
│   └── logo_vitae.png      → logo real del hotel
└── referencia/
    └── base-estilo-hero.html → mockup del header + hero de la web actual,
                                  usado para validar que la paleta/tipografía
                                  coincidieran antes de construir el portal
```

## Cómo funciona

1. **Selector de sede**: el huésped elige entre Galery, Galerías o Corferias. En producción esto se saltaría solo, porque cada sede tendría su propio QR/link.
2. **Dashboard**: 7 accesos en forma de tarjeta (Wifi, Check-in/Llave, Reglas, Traslados, Alimentación, Contacto, Guía del huésped).
3. **Contenido por sede vs. centralizado**: Wifi, llave, reglas y contacto cambian según la sede. Traslados y horarios de alimentación son iguales para las tres, según lo confirmado con el cliente.
4. **Guía del huésped**: resumen con enlaces a los demás accesos, más información que no está en ningún otro lado (zona, emergencia médica, check-out).

## Qué es real y qué es dato de ejemplo (placeholder)

Todo vive en `js/script.js`, dentro de los objetos `SEDES` y `GLOBAL`, para que sea fácil de ubicar y editar.

| Dato | Estado |
|---|---|
| Nombres y direcciones de las 3 sedes | ✅ Real (tomado de la web) |
| Horario de atención por sede | ✅ Real |
| Número de contacto / traslados | ✅ Real (+57 318 387 4491) |
| Wifi (red y contraseña) | 🟡 Placeholder — falta dato real por sede |
| Instrucciones de llave/check-in | 🟡 Placeholder — falta redactar con el cliente |
| Reglas del hotel | 🟡 Placeholder — falta confirmar si son iguales o cambian por sede |
| Horarios de comida | 🟡 Placeholder — falta horario real |
| QR de wifi | 🟡 Genérico de ejemplo, no funcional |

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
