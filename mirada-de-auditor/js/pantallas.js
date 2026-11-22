// Mirada de auditor · pantallas de Patitas (Alerta de mascota perdida).
// Cada parte marcable lleva data-r con el id de la región en instrumento.js.
// data-lente="<problema>" indica dónde se posa la lente; si falta, se usa la primera región del problema.
// 1.2: las pantallas llevan foto real, mapa con calles e iconos dibujados. Con emojis y un mapa abstracto,
// la maqueta misma se leía como falla (prueba del 20/11/2026). En Foto la mascota va con un marcador vacío: la foto todavía no subió.

const barra = (r, titulo) =>
  `<div class="pt-bar" data-r="${r}"><span class="pt-back">←</span><b>${titulo}</b></div>`;

const pasos = (r, n, nombre) =>
  `<div class="pt-steps" data-r="${r}"><div class="pt-seg">${[1, 2, 3].map((i) => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</div><small>Paso ${n} de 3 · ${nombre}</small></div>`;

export const PANTALLA_HTML = {
  foto: `
    ${barra("foto-barra", "Alerta de mascota perdida")}
    ${pasos("foto-pasos", 1, "Foto y contacto")}
    <div class="pt-body">
      <div class="pt-pet" data-r="foto-mascota"><div class="pt-im vacia"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="16.2" rx="5" ry="4.1"/><circle cx="5.2" cy="10.6" r="2.1"/><circle cx="9.3" cy="6.6" r="2.2"/><circle cx="14.7" cy="6.6" r="2.2"/><circle cx="18.8" cy="10.6" r="2.1"/></svg></div><div><b>Luna</b><small>Gata negra y blanca · 3 años</small><small>Vista hoy, 18:40</small></div></div>
      <div data-r="foto-archivo">
        <div class="pt-lb">Foto de Luna</div>
        <div class="pt-up" data-lente="error-codigo"><div class="pt-ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg></div><div class="pt-upt"><b>IMG_2291.HEIC</b><small>Error: upload_failed (415)</small></div><span class="pt-a">Reintentar</span></div>
      </div>
      <div data-r="foto-telefono">
        <div class="pt-lb">Teléfono de contacto</div>
        <div class="pt-in">600 000 000</div>
        <div class="pt-help">Solo lo ve quien toque «Vi a esta mascota»</div>
      </div>
    </div>
    <div class="pt-foot"><div class="pt-btn off" data-r="foto-boton">Siguiente</div></div>`,

  zona: `
    ${barra("zona-barra", "Alerta de mascota perdida")}
    ${pasos("zona-pasos", 2, "Zona")}
    <div class="pt-body">
      <div class="pt-h" data-r="zona-pregunta">¿Dónde viste a Luna por última vez?</div>
      <div class="pt-mapw" data-r="zona-mapa"><div class="pt-map">
        <svg viewBox="0 0 358 176" preserveAspectRatio="xMidYMid slice" aria-hidden="true" font-family="Inter,system-ui,sans-serif">
          <rect width="358" height="176" fill="#e9eef0"/>
          <g stroke="#fff" stroke-linecap="round" fill="none">
            <g stroke-width="4"><path d="M0 62h118M240 62h118M0 98h112M246 98h112M84 0v176M274 0v176M132 150v26M226 150v26M150 0v14M208 0v14"/></g>
            <g stroke-width="9"><path d="M0 22l358-10M0 140l358 12M36 0v176M322 0v176"/></g>
            <circle cx="179" cy="78" r="60" stroke-width="7"/>
          </g>
          <circle cx="179" cy="78" r="53" fill="#cfe8d2"/>
          <ellipse cx="196" cy="62" rx="15" ry="9" fill="#bfdcee"/>
          <g font-size="8.5" fill="#475569">
            <text x="52" y="136">Av. Díaz Vélez</text>
            <text x="228" y="12">Av. Ángel Gallardo</text>
            <text transform="translate(33 118) rotate(-90)">Río de Janeiro</text>
            <text transform="translate(319 122) rotate(-90)">L. Marechal</text>
          </g>
          <text x="179" y="112" text-anchor="middle" font-size="9.5" font-weight="600" fill="#2f6b45">Parque Centenario</text>
        </svg>
        <i class="pt-radio"></i><i class="pt-pin"><svg viewBox="0 0 24 30" width="26" height="32" aria-hidden="true"><path d="M12 29C12 29 2 18.5 2 11.5a10 10 0 0 1 20 0C22 18.5 12 29 12 29z" fill="#dc2626" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11.5" r="3.6" fill="#fff"/></svg></i>
      </div></div>
      <div class="pt-inst" data-r="zona-instruccion"><span data-lente="contraste">¿No es el lugar? Cámbialo abajo</span></div>
      <div class="pt-dir" data-r="zona-direccion"><div><b>Parque Centenario</b><small>Entrada de Av. Díaz Vélez</small></div><span class="pt-a">Cambiar</span></div>
      <div class="pt-alc" data-r="zona-alcance">Tu alerta llega a <b>2 km</b> a la redonda</div>
    </div>
    <div class="pt-foot" data-lente="peso-invertido">
      <div class="pt-btn" data-r="zona-planes">Ver planes de difusión</div>
      <div class="pt-link" data-r="zona-seguir">Siguiente</div>
    </div>`,

  revisar: `
    ${barra("rev-barra", "Alerta de mascota perdida")}
    ${pasos("rev-pasos", 3, "Revisar")}
    <div class="pt-body">
      <div class="pt-pet" data-r="rev-mascota"><div class="pt-im foto"><img src="assets/luna-cara.jpg" alt=""></div><div><b>Luna</b><small>Gata negra y blanca · 3 años · vista hoy, 18:40</small><span class="pt-a">Cambiar</span></div></div>
      <div class="pt-row" data-r="rev-zona"><div><div class="pt-lb">Zona</div><b>Parque Centenario</b><small>2 km a la redonda</small></div><span class="pt-a">Cambiar</span></div>
      <div class="pt-row" data-r="rev-contacto"><div><div class="pt-lb">Contacto</div><b>600 000 000</b><small>Solo lo ve quien toque «Vi a esta mascota»</small></div><span class="pt-a">Cambiar</span></div>
      <div class="pt-costo" data-r="rev-costo">Publicar la alerta no tiene costo</div>
    </div>
    <div class="pt-foot"><div class="pt-btn" data-r="rev-boton">Publicar alerta</div></div>`,

  ia: `
    ${barra("ia-barra", "Alerta de Luna")}
    <div class="pt-body">
      <div class="pt-cert" data-lente="certeza">
        <div class="pt-tit" data-r="ia-titular">✨ ¡Encontramos a Luna!</div>
        <div class="pt-chip" data-r="ia-porcentaje"><b>Coincidencia: 62 %</b><small>Comparado con IA</small></div>
      </div>
      <div class="pt-foto" data-r="ia-foto"><div class="pt-fim"><img src="assets/luna-marcos.jpg" alt=""></div><small>Foto de Marcos R. · hace 20 min · a 1,4 km</small></div>
    </div>
    <div class="pt-foot" data-lente="cierre">
      <div class="pt-btn" data-r="ia-cerrar">Cerrar mi alerta</div>
      <div class="pt-links" data-r="ia-enlaces"><span>Escribirle a Marcos</span></div>
    </div>`,
};
