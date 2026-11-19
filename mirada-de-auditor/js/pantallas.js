// Mirada de auditor · pantallas de Patitas (Alerta de mascota perdida).
// Cada parte marcable lleva data-r con el id de la región en instrumento.js.
// data-lente="<problema>" indica dónde se posa la lente; si falta, se usa la primera región del problema.
// Los emojis son parte del estilo de Patitas (una app ficticia hecha con IA), no de la interfaz del juego.

const barra = (r, titulo) =>
  `<div class="pt-bar" data-r="${r}"><span class="pt-back">←</span><b>${titulo}</b></div>`;

const pasos = (r, n, nombre) =>
  `<div class="pt-steps" data-r="${r}"><div class="pt-seg">${[1, 2, 3].map((i) => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</div><small>Paso ${n} de 3 · ${nombre}</small></div>`;

export const PANTALLA_HTML = {
  foto: `
    ${barra("foto-barra", "Alerta de mascota perdida")}
    ${pasos("foto-pasos", 1, "Foto y contacto")}
    <div class="pt-body">
      <div class="pt-pet" data-r="foto-mascota"><div class="pt-im">🐱</div><div><b>Luna</b><small>Gata gris · 3 años</small><small>Vista hoy, 18:40</small></div></div>
      <div data-r="foto-archivo">
        <div class="pt-lb">Foto de Luna</div>
        <div class="pt-up" data-lente="error-codigo"><div class="pt-ic">🖼</div><div class="pt-upt"><b>IMG_2291.HEIC</b><small>Error: upload_failed (415)</small></div><span class="pt-a">Reintentar</span></div>
      </div>
      <div data-r="foto-telefono">
        <div class="pt-lb">Teléfono de contacto</div>
        <div class="pt-in">600 000 000</div>
        <div class="pt-help">Solo lo ve quien toque «Vi a esta mascota»</div>
      </div>
    </div>
    <div class="pt-foot"><div class="pt-btn off" data-r="foto-boton">Continuar</div></div>`,

  zona: `
    ${barra("zona-barra", "Alerta de mascota perdida")}
    ${pasos("zona-pasos", 2, "Zona")}
    <div class="pt-body">
      <div class="pt-h" data-r="zona-pregunta">¿Dónde viste a Luna por última vez?</div>
      <div class="pt-mapw" data-r="zona-mapa"><div class="pt-map">
        <i class="pt-calle h" style="top:34%"></i><i class="pt-calle h" style="top:72%"></i>
        <i class="pt-calle v" style="left:22%"></i><i class="pt-calle v" style="left:78%"></i>
        <i class="pt-parque"></i><i class="pt-radio"></i><i class="pt-pin">📍</i>
      </div></div>
      <div class="pt-inst" data-r="zona-instruccion"><span data-lente="contraste">¿No es el lugar? Cámbialo abajo</span></div>
      <div class="pt-dir" data-r="zona-direccion"><div><b>Parque Centenario</b><small>Entrada de Av. Díaz Vélez</small></div><span class="pt-a">Cambiar</span></div>
      <div class="pt-alc" data-r="zona-alcance">Tu alerta llega a <b>2 km</b> a la redonda</div>
    </div>
    <div class="pt-foot" data-lente="peso-invertido">
      <div class="pt-btn" data-r="zona-planes">Ver planes de difusión</div>
      <div class="pt-link" data-r="zona-seguir">Continuar</div>
    </div>`,

  revisar: `
    ${barra("rev-barra", "Alerta de mascota perdida")}
    ${pasos("rev-pasos", 3, "Revisar")}
    <div class="pt-body">
      <div class="pt-pet" data-r="rev-mascota"><div class="pt-im foto">🐈</div><div><b>Luna</b><small>Gata gris · 3 años · vista hoy, 18:40</small><span class="pt-a">Cambiar foto</span></div></div>
      <div class="pt-row" data-r="rev-zona"><div><div class="pt-lb">Zona</div><b>Parque Centenario</b><small>2 km a la redonda</small></div><span class="pt-a">Cambiar zona</span></div>
      <div class="pt-row" data-r="rev-contacto"><div><div class="pt-lb">Contacto</div><b>600 000 000</b><small>Solo lo ve quien toque «Vi a esta mascota»</small></div><span class="pt-a">Cambiar contacto</span></div>
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
      <div class="pt-foto" data-r="ia-foto"><div class="pt-fim">🐈</div><small>Foto de Marcos R. · hace 20 min · a 1,4 km</small></div>
    </div>
    <div class="pt-foot" data-lente="cierre">
      <div class="pt-btn" data-r="ia-cerrar">Cerrar mi alerta</div>
      <div class="pt-links" data-r="ia-enlaces"><span>Ver la foto en grande</span><span>Escribirle a Marcos</span></div>
    </div>`,
};
