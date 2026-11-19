// Mirada de auditor · resultado (a la vista) y desglose (se abre desde el correo).
// Resultado: cuántos problemas encontró, dónde está en el camino y el pedido del desglose. Poco texto, a propósito.
// Desglose: problema por problema, las cinco habilidades y la ruta.
import { PANTALLAS, ORDENAR, DECIR, ACTOS, NIVELES, DESTINO, DESGLOSE, AVISO_ORIENTACION, ETIQUETAS_BANDA, PERFIL, PRECIOS, NOMBRE } from "./instrumento.js";
import { temaActual } from "./tema.js";
import { puntuar } from "./puntaje.js";
import { CONFIG } from "./config.js";
import { evento, guardarResultado, pedirDesglose, DESDE_PASO0, PRIMERO_CAMINO, LOCAL } from "./datos.js";
import { ic, esc } from "./util.js";

// ---------- enlaces (todo va en el #, nada se lee de un servidor) ----------
// #r=<código> abre el resultado; #d=<código> abre el desglose.
const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const de64 = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));
export function hacerCodigo(S) {
  const m = {};
  for (const p of PANTALLAS) m[p.id] = (S.marcas[p.id] || []).map((id) => p.regiones.findIndex((r) => r.id === id));
  const p = PERFIL.map((q) => (S.perfil?.[q.id] === true ? "1" : S.perfil?.[q.id] === false ? "0" : "-")).join("");
  return b64(JSON.stringify({ m, c: S.criterios, o: S.orden.join(""), d: S.decir, p, s: S.segundos ?? Math.round((Date.now() - S.t0) / 1000) }));
}
const sitio = () => location.origin + location.pathname;
export const hacerEnlace = (S, modo = "r") => `${sitio()}#${modo}=${hacerCodigo(S)}`;
export function leerEnlace() {
  const h = location.hash.match(/^#([rd])=([\w-]+)$/); if (!h) return null;
  try {
    const d = JSON.parse(de64(h[2])), marcas = {};
    for (const p of PANTALLAS) marcas[p.id] = (d.m?.[p.id] || []).map((i) => p.regiones[i]?.id).filter(Boolean);
    const orden = String(d.o || "").split("").filter((x) => "ABCD".includes(x));
    const perfil = {}; PERFIL.forEach((q, i) => { const v = String(d.p || "")[i]; if (v === "1") perfil[q.id] = true; else if (v === "0") perfil[q.id] = false; });
    return { modo: h[1], marcas, criterios: d.c || {}, orden, decir: d.d || {}, perfil, segundos: +d.s || 0, t0: Date.now() };
  } catch (e) { return null; }
}

// El titular tiene dos frases: lo que ya hace (peso bajo) y su salto profesional (peso alto).
// Dos pesos: la primera frase va liviana y la segunda lleva el peso.
function dosPesos(texto) {
  const i = texto.indexOf(". ");
  const antes = i < 0 ? "" : texto.slice(0, i + 1), fuerte = i < 0 ? texto : texto.slice(i + 2);
  return `${antes ? `<span class="antes">${antes}</span> ` : ""}<span class="grande">${fuerte}</span>`;
}
function titularHTML(R, id, tag) {
  return `<${tag} id="${id}" class="titular" tabindex="-1">${dosPesos(R.titular)}</${tag}>`;
}

const sinMov = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------- piezas compartidas ----------
function botonCamino(id) {
  return DESDE_PASO0
    ? `<a class="btn p" id="${id}" href="${CONFIG.paso0}">Volver al Paso 0${ic("flecha")}</a>`
    : `<a class="btn p" id="${id}" href="${CONFIG.skool}" target="_blank" rel="noopener">Ver el camino de auditor${ic("flecha")}<span class="sr"> (se abre en una pestaña nueva)</span></a>`;
}
// Precios: salen de PRECIOS (instrumento.js). La certificación se nombra solo en los dos puntos de partida altos.
// El precio del VIP va solo en los resultados completos: en la primera pantalla frenaba (revisiones del 19/11/2026).
function bloqueCamino(R, id, conVip = false) {
  const altos = R.nivel === "ordenas" || R.nivel === "defiendes";
  const precio = DESDE_PASO0 ? "" : `<p class="precio">El camino completo cuesta ${PRECIOS.premiumMes} USD al mes, con el plan Premium.</p>`;
  const vip = conVip && !DESDE_PASO0 && altos ? `<p class="precio">La certificación se obtiene solo con el plan VIP: ${PRECIOS.vipAnio} USD al año, precio de fundadores para las primeras 10 personas. Después, ${PRECIOS.vipDespues} USD al año.</p>` : "";
  return `
    <section class="cta" aria-labelledby="${id}t">
      <h2 id="${id}t">De aquí a cobrar por evaluar productos</h2>
      <p>El camino de auditor: 7 pasos en Comunidad UX/UI.</p>
      <div class="fila">${botonCamino(id)}</div>
      ${precio}${vip}
    </section>`;
}
function bloqueCalculo(propio, alRepetirTexto) {
  return `
    <section class="cierre">
      <p class="nota">${AVISO_ORIENTACION}</p>
      <details><summary>${ic("flecha")}Cómo se calculó ${propio ? "tu" : "este"} resultado</summary>
        <ul>
          <li>Ver: un punto por cada problema marcado en Foto y en Zona, más uno por decir que Revisar estaba bien. Cada marca sobre algo que funciona resta medio punto.</li>
          <li>Nombrar: un punto por cada problema que marcaste en esas dos pantallas y al que le pusiste el criterio correcto.</li>
          <li>Priorizar: tres decisiones del orden, un punto cada una.</li>
          <li>Revisar la IA: un punto por cada problema marcado y uno por cada criterio correcto. Las marcas de más también restan.</li>
          <li>Defender: un punto por cada frase.</li>
          <li>Los puntos de partida van en el orden del camino. «Nombras» pide 3 o más en Ver y el criterio correcto en lo que marcaste (con los cuatro marcados, alcanza con 3); «Priorizas» suma 2 o más en Priorizar; «Defiendes» suma las dos frases y 2 o más en la IA.</li>
        </ul>
      </details>
      ${alRepetirTexto ? `<div><button class="btn s" id="otra">${ic("repite")}${alRepetirTexto}</button></div>` : ""}
    </section>`;
}
// El camino: cuatro estaciones y el destino. Se reconoce antes de leerlo.
function caminoHTML(R, propio) {
  const iNivel = NIVELES.findIndex((n) => n.id === R.nivel);
  const est = NIVELES.map((n, i) => {
    // Si el salto es «ver», la primera estación está en curso: se marca «aquí» sin darla por lograda.
    const cls = i === iNivel ? (R.salto === "ver" ? "aqui" : "aqui hecha") : i < iNivel ? "hecha" : "";
    return `<li class="${cls}"><span class="nodo" aria-hidden="true">${ic(n.ic)}</span><div>${i === iNivel ? `<span class="tu">${!propio ? "Punto de partida" : R.salto === "ver" ? "El camino empieza aquí" : "Estás aquí"}</span>` : ""}<b>${n.nombre}</b><small>${n.corto}</small>${i < iNivel ? '<span class="sr"> (logrado)</span>' : ""}</div></li>`;
  }).join("");
  return `<div class="camino-caja"><ol class="camino" aria-label="El camino de auditor: cuatro puntos de partida y el destino">${est}<li class="meta"><span class="nodo" aria-hidden="true">${ic(DESTINO.ic)}</span><div><span class="tu">Destino</span><b>${DESTINO.nombre}</b><small>${DESTINO.corto}</small></div></li></ol><span class="foco" aria-hidden="true"></span></div>`;
}
function posarFoco(main) {
  // La lente viaja por el camino hasta la estación de la persona.
  const caja = main.querySelector(".camino-caja");
  if (!caja) return; // quien abre un enlace compartido no ve el camino de la otra persona
  const foco = caja.querySelector(".foco"), nodo = caja.querySelector("li.aqui .nodo"), primero = caja.querySelector("li .nodo");
  const posar = (animar) => {
    const c = caja.getBoundingClientRect(), a = nodo.getBoundingClientRect(), p = primero.getBoundingClientRect();
    const m = 6, r = { x: a.left - c.left - m, y: a.top - c.top - m, w: a.width + m * 2 };
    Object.assign(foco.style, { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.w + "px" });
    if (animar && !sinMov()) {
      foco.style.transition = "none";
      foco.style.transform = `translate(${p.left - a.left}px,${p.top - a.top}px) scale(1.6)`;
      foco.getBoundingClientRect(); foco.style.transition = ""; foco.style.transform = "none";
    }
    foco.classList.add("on");
  };
  requestAnimationFrame(() => posar(true));
  addEventListener("resize", () => { if (document.body.contains(foco)) posar(false); });
}

// ---------- resultado ----------
export function mostrarResultado(main, S, { propio, alRepetir, previa = false, medir = true }) {
  const R = puntuar(S);
  const codigo = hacerCodigo(S);
  const enlace = `${sitio()}#r=${codigo}`;
  // "previa" muestra el resultado como lo ve quien jugó, sin guardar ni medir (para revisar los resultados posibles).
  if (propio && !previa) {
    history.replaceState(null, "", location.pathname + location.search + "#r=" + codigo);
    if (medir) { evento("fin", { nivel: R.nivel }); guardarResultado(R, S, temaActual()); }
  }

  const puntos = PANTALLAS.flatMap((p) => p.problemas.map((pr) => R.detalle[p.id].vistos.includes(pr.id)))
    .map((v, i) => `<li class="${v ? "si" : "no"}" style="--i:${i}">${v ? ic("check") : ""}</li>`).join("");
  // Compartir es un reto (Anita, 19/11/2026): se comparte para que otra persona juegue, no para mostrar lo que falta.
  // Con 3 o más, el reto lleva el número. Con menos, va sin número: nadie comparte un resultado bajo.
  const conNumero = R.hallados >= RETO_DESDE;
  const texto = conNumero
    ? `Encontré ${R.hallados} de ${R.sembrados} problemas en una app. ¿Cuántos ves tú? Es «${NOMBRE}», la simulación de auditoría UX/UI de Comunidad UX/UI.`
    : `Hay ${R.sembrados} problemas escondidos en una app. ¿Cuántos ves tú? Es «${NOMBRE}», la simulación de auditoría UX/UI de Comunidad UX/UI.`;
  const enlaceReto = conNumero ? enlace : `${sitio()}?reto`;
  const linkedin = "https://www.linkedin.com/feed/?shareActive=true&text=" + encodeURIComponent(`${texto} ${sitio()}?reto`);

  // La plantilla se promete solo si tiene enlace (en local se muestra igual, para revisar el texto).
  const conPlantilla = !!CONFIG.plantillaUrl || LOCAL;
  const traeHTML = `<ul class="trae">${DESGLOSE.trae.map((t) => `<li>${ic("check")}${t}</li>`).join("")}${conPlantilla ? `<li class="extra">${ic("regalo")}${DESGLOSE.plantilla}</li>` : ""}</ul>`;
  const pedirTitulo = DESDE_PASO0 ? "Tus resultados completos" : DESGLOSE.titulo(R.sembrados - R.hallados);
  // Si ya los pidió en esta sesión, no se le vuelve a pedir el correo.
  const CLAVE_PEDIDO = "mirada-pedido";
  const yaPedido = (() => { try { return sessionStorage.getItem(CLAVE_PEDIDO) === codigo; } catch (e) { return false; } })();
  // El desglose se pide por correo. Quien llega desde el Paso 0 ya es parte de la comunidad: lo abre directo.
  const pedir = !propio ? "" : DESDE_PASO0 ? `
    <section class="pedir" aria-labelledby="r3">
      <div><h2 id="r3" class="titular">${dosPesos(pedirTitulo)}</h2>${traeHTML}</div>
      <div class="pedir-form"><a class="btn p" href="#d=${codigo}">Ver mis resultados completos${ic("flecha")}</a></div>
    </section>` : yaPedido ? `
    <section class="pedir" aria-labelledby="r3">
      <div><h2 id="r3" class="titular">${dosPesos(pedirTitulo)}</h2>${traeHTML}</div>
      <div class="pedir-form"><p class="msj ok">Ya los pediste.</p><a class="btn p" href="#d=${codigo}">Ver mis resultados completos${ic("flecha")}</a></div>
    </section>` : `
    <section class="pedir" aria-labelledby="r3">
      <div><h2 id="r3" class="titular">${dosPesos(pedirTitulo)}</h2>${traeHTML}</div>
      <form class="pedir-form" id="pd" novalidate>
        <label for="correo">Tu correo</label>
        <div class="campo"><input id="correo" name="correo" type="email" autocomplete="email" inputmode="email" placeholder="tu@correo.com" required aria-describedby="pdmsj"></div>
        <label class="casilla" for="quiere"><input type="checkbox" id="quiere" name="newsletter"><span>Quiero recibir también Minuto UX, nuestro newsletter</span></label>
        <div class="campo"><button class="btn p" type="submit">${ic("correo")}Enviármelos</button></div>
        <p class="legal" id="pdlegal">Usamos tu correo para enviarte tus resultados. <a href="${CONFIG.legales}">Privacidad</a></p>
        <p class="msj" id="pdmsj" role="status"></p>
      </form>
    </section>`;

  main.innerHTML = `
  <div class="res">
    <section class="marcador entra" aria-labelledby="r1">
      ${propio ? "" : `<p class="mono">Resultado de otra persona</p>`}
      <h1 id="r1" tabindex="-1"><span class="sr">${propio ? "Encontraste" : "Encontró"} ${R.hallados} de ${R.sembrados} problemas</span><span class="num${R.hallados ? "" : " cero"}" aria-hidden="true"><b id="cuenta">${R.hallados}</b> de ${R.sembrados}</span><span class="que" aria-hidden="true">problemas encontrados</span></h1>
      <ol class="puntos" aria-hidden="true">${puntos}</ol>
    </section>

    ${propio ? `<section class="camino-sec" aria-labelledby="r2">
      ${titularHTML(R, "r2", "h2")}
      ${caminoHTML(R, propio)}
    </section>` : `<section class="camino-sec" aria-labelledby="r2">
      <h2 class="titular" id="r2" tabindex="-1"><span class="grande">¿Cuántos ves tú?</span></h2>
      <div><button class="btn p grande" id="jugar">Jugar${ic("flecha")}</button></div>
    </section>`}

    ${PRIMERO_CAMINO ? "" : pedir}
    ${propio ? bloqueCamino(R, "skool1") : ""}
    ${PRIMERO_CAMINO ? pedir : ""}

    ${propio ? `<section class="comparte" aria-labelledby="r6">
      <h2 id="r6">Reta a tu equipo</h2>
      <div class="fila"><button class="btn s" id="copiar">${ic("copia")}Copiar enlace</button><a class="btn s" id="li" href="${linkedin}" target="_blank" rel="noopener">${ic("comparte")}LinkedIn<span class="sr"> (se abre en una pestaña nueva)</span></a><button class="btn s" id="img">${ic("descarga")}Imagen</button></div>
      <div id="imgzona"></div>
    </section>` : ""}

    ${bloqueCalculo(propio, propio ? "Jugar otra vez" : "")}
  </div>`;

  const $ = (s) => main.querySelector(s);
  $("#r1").focus({ preventScroll: true });
  // El número sube hasta el resultado (solo a la vista: el lector de pantalla ya oyó la cifra).
  const cuenta = $("#cuenta");
  if (!sinMov() && R.hallados > 0) {
    cuenta.textContent = "0"; let n = 0;
    const t = setInterval(() => { n += 1; cuenta.textContent = String(n); if (n >= R.hallados) clearInterval(t); }, 110);
  }
  posarFoco(main);
  $("#otra")?.addEventListener("click", alRepetir);
  $("#jugar")?.addEventListener("click", alRepetir);
  $("#skool1")?.addEventListener("click", () => evento("clic_skool", { nivel: R.nivel, lugar: "resultado" }));
  $("#li")?.addEventListener("click", () => evento("compartir", { via: "linkedin" }));
  $("#copiar")?.addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(enlaceReto); b.innerHTML = `${ic("check")}Enlace copiado`; evento("compartir", { via: "enlace" }); }
    catch (err) { b.insertAdjacentHTML("afterend", `<p class="nota" style="word-break:break-all">${esc(enlaceReto)}</p>`); b.remove(); }
  });
  $("#img")?.addEventListener("click", async () => {
    const url = await imagen(R);
    $("#imgzona").innerHTML = `<img class="imgcomp" src="${url}" alt="Imagen para compartir: ${conNumero ? `Encontré ${R.hallados} de ${R.sembrados} problemas en una app.` : `Hay ${R.sembrados} problemas escondidos en una app.`} ¿Cuántos ves tú?"><p style="margin-top:.5rem"><a class="btn s" href="${url}" download="mirada-de-auditor.png">${ic("descarga")}Guardar la imagen</a></p>`;
    evento("compartir", { via: "imagen" });
  });
  $("#pd")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget, campo = $("#correo"), msj = $("#pdmsj"), bot = form.querySelector("button");
    const correo = campo.value.trim();
    const error = (t) => { msj.className = "msj err"; msj.textContent = t; campo.setAttribute("aria-invalid", "true"); campo.focus(); };
    if (!correo) return error("Escribe tu correo.");
    if (!CORREO.test(correo)) return error("Revisa el correo: algo falta o está mal escrito.");
    campo.removeAttribute("aria-invalid"); bot.disabled = true; msj.className = "msj"; msj.textContent = "Enviando…";
    const abrir = `<a href="#d=${codigo}">Abrir mis resultados completos</a>`;
    const recordar = () => { try { sessionStorage.setItem(CLAVE_PEDIDO, codigo); } catch (err) { /* sin almacenamiento: se vuelve a pedir */ } };
    const quiere = $("#quiere").checked;
    const cerrar = () => { form.querySelectorAll(".campo").forEach((c) => { c.hidden = true; }); form.querySelector("label").hidden = true; form.querySelector(".casilla").hidden = true; $("#pdlegal").hidden = true; };
    try {
      const r = previa ? "sin-conectar" : await pedirDesglose(correo, codigo, R, quiere);
      if (r === "invalido") { bot.disabled = false; return error("Revisa el correo: algo falta o está mal escrito."); }
      if (r === "enviado") { msj.className = "msj ok"; msj.innerHTML = `Listo. Revisa <b>${esc(correo)}</b>. Si no llega, mira en promociones. También están aquí: ${abrir}`; evento("correo"); }
      else { msj.className = "msj"; msj.innerHTML = `${r === "sin-conectar" ? "El envío por correo todavía no está conectado." : "No pudimos enviarte el correo."} Aquí los tienes: ${abrir}`; if (r !== "sin-conectar") evento("correo", { envio: false }); }
      cerrar(); recordar();
    } catch (err) { msj.className = "msj err"; msj.textContent = "No se pudo enviar. Revisa tu conexión e intenta de nuevo."; bot.disabled = false; }
  });
}

// ---------- desglose ----------
// Aquí se ve por primera vez qué estaba bien y qué no. Cada fila se abre para ver el detalle.
const fila = (ok, titulo, meta, cuerpo) => `<li><details><summary><span class="est ${ok ? "si" : "no"}" aria-hidden="true">${ic(ok ? "check" : "x")}</span><span class="tit"><b>${titulo}</b>${meta ? `<small>${meta}</small>` : ""}</span><span class="sr">${ok ? " (bien)" : " (para revisar)"}</span>${ic("flecha", "abre")}</summary><div class="exp">${cuerpo}</div></details></li>`;

export function mostrarDesglose(main, S, { alRepetir }) {
  const R = puntuar(S);
  const nivel = NIVELES.find((n) => n.id === R.nivel);
  const okDe = (ops) => ops.find((o) => o.ok);
  const elegida = (ops, i) => (i === undefined ? null : ops[i] || null);

  const problemas = PANTALLAS.flatMap((p) => p.problemas.map((pr) => {
    const visto = R.detalle[p.id].vistos.includes(pr.id), e = elegida(pr.opciones, S.criterios[pr.id]), crit = !!e?.ok;
    // Si lo marcó, hay un segundo dato: si después eligió bien por qué es un problema. Si no lo marcó, el juego no se lo preguntó.
    const meta = visto ? `Lo marcaste · ${crit ? "porqué correcto" : "porqué incorrecto"}` : "No lo marcaste";
    const cuerpo = visto
      ? `${e && !crit ? `<p><b>Tu respuesta:</b> ${esc(e.t)}.</p><p class="porque">${esc(e.nota)}</p>` : ""}<p><b>La correcta:</b> ${esc(okDe(pr.opciones).t)}.</p><p class="porque">${pr.criterio}</p>`
      : `<p>${pr.que}</p><p><b>Por qué es un problema:</b> ${esc(okDe(pr.opciones).t)}.</p><p class="porque">${pr.criterio}</p>`;
    return fila(visto && crit, pr.titulo, meta, cuerpo);
  })).join("");
  const orden = ORDENAR.comprobaciones.map((c) => fila(R.orden[c.id], c.t, "", `<p>${c.porque}</p>`)).join("");
  const frases = DECIR.map((d, i) => {
    const e = elegida(d.opciones, S.decir[d.id]), ok = !!e?.ok;
    const cuerpo = `${e && !ok ? `<p><b>Tu frase:</b> ${esc(e.t)}</p><p class="porque">${esc(e.nota)}</p>` : ""}<p><b>La correcta:</b> ${esc(okDe(d.opciones).t)}</p><p class="porque">${d.porque}</p>`;
    return fila(ok, i === 0 ? "La frase que abre tu resumen" : "Tu recomendación", "", cuerpo);
  }).join("");
  const habs = ACTOS.map((a) => {
    const v = R.puntos[a.id], mx = R.maximos[a.id];
    const seg = Array.from({ length: mx }, (_, i) => `<i class="${v >= i + 1 ? "on" : v > i ? "media" : ""}" style="--i:${i}"></i>`).join("");
    return `<li><span class="nom">${ic(a.ic)}${a.nombre}</span><span class="medidor" aria-hidden="true">${seg}</span><span class="val">${String(v).replace(".", ",")} de ${mx}</span></li>`;
  }).join("");
  const todoAlto = R.nivel === "defiendes";
  const ruta = R.ruta.map((b) => {
    const aqui = b.pasos === R.empiezaEn;
    const et = aqui ? (todoAlto ? "Tu siguiente paso" : "Tu foco") : b.banda ? ETIQUETAS_BANDA[b.banda] : "Certificación";
    return `<li class="${aqui ? "empieza" : ""}"><b>${b.pasos}<small>${et}</small></b><span>${b.texto}</span></li>`;
  }).join("");
  // La pantalla sin fallas también cuenta (por eso «Ver» suma hasta 5): tiene su fila.
  const limpia = R.detalle.revisar, pLimpia = PANTALLAS.find((p) => p.id === "revisar");
  const filaLimpia = fila(limpia.limpiaBien, "La pantalla «Revisar» no tenía fallas", limpia.limpiaBien ? "No marcaste nada" : `Marcaste ${limpia.falsas === 1 ? "una parte" : limpia.falsas + " partes"}`, `<p>${pLimpia.limpia.texto}</p>`);
  const notas = R.falsas ? `En total marcaste ${R.falsas === 1 ? "una parte que funcionaba" : R.falsas + " partes que funcionaban"}. Cada una resta medio punto.` : "";

  main.innerHTML = `
  <div class="res des">
    <section class="entra" aria-labelledby="d1">
      ${titularHTML(R, "d1", "h1")}
      <ul class="fichas"><li><b>${R.hallados} de ${R.sembrados}</b> encontrados</li><li>${ic(nivel.ic)}Estás en: <b>${nivel.nombre}</b></li></ul>
    </section>

    <section aria-labelledby="d2"><h2 id="d2">Respuesta por respuesta</h2>
      <h3 class="mono">Las pantallas</h3><ol class="resp">${problemas}${filaLimpia}</ol>${notas ? `<p class="nota">${notas}</p>` : ""}
      <h3 class="mono">El orden</h3><ol class="resp">${orden}</ol>
      <h3 class="mono">Tus frases</h3><ol class="resp">${frases}</ol>
    </section>

    ${CONFIG.plantillaUrl || LOCAL ? `<section class="plantilla" aria-labelledby="dp"><h2 id="dp">${ic("regalo")}${DESGLOSE.plantillaTitulo}</h2>${CONFIG.plantillaUrl ? `<a class="btn p" href="${CONFIG.plantillaUrl}" target="_blank" rel="noopener">${DESGLOSE.plantillaBoton}${ic("flecha")}</a>` : `<p class="mono">Falta elegir la plantilla y cargar su enlace (plantillaUrl en config.js). Este aviso solo se ve en local.</p>`}</section>` : ""}

    <section aria-labelledby="d3"><h2 id="d3">Tus 5 habilidades</h2><ul class="habs">${habs}</ul></section>

    <section aria-labelledby="d4"><h2 id="d4">Tu ruta</h2><ol class="ruta">${ruta}</ol></section>

    ${bloqueCamino(R, "skool2", true)}
    ${bloqueCalculo(true, "Jugar otra vez")}
  </div>`;
  main.querySelector("#d1").focus({ preventScroll: true });
  main.querySelector("#otra").addEventListener("click", alRepetir);
  main.querySelector("#skool2").addEventListener("click", () => evento("clic_skool", { nivel: R.nivel, lugar: "desglose" }));
}

// ---------- imagen para compartir (1080 × 1350) ----------
// Es un reto, no un diagnóstico: el número (si es de 3 o más), la pregunta y dónde jugar. Nada sobre lo que falta.
const RETO_DESDE = 3;
async function imagen(R) {
  await document.fonts.ready;
  const conNumero = R.hallados >= RETO_DESDE;
  const W = 1080, H = 1350, c = Object.assign(document.createElement("canvas"), { width: W, height: H }), x = c.getContext("2d");
  x.fillStyle = "#0D1412"; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W / 2, 0, 0, W / 2, 0, 900); g.addColorStop(0, "#16241F"); g.addColorStop(1, "rgba(13,20,18,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = "#A9B8B1"; x.font = '500 30px "IBM Plex Mono", monospace'; x.fillText("SIMULACIÓN DE AUDITORÍA UX/UI", 90, 150);
  x.fillStyle = "#EEF3F0"; x.font = '800 84px "Bricolage Grotesque", sans-serif'; x.fillText(NOMBRE, 90, 250);
  // la lente, con el número adentro
  x.save(); x.shadowColor = "rgba(255,77,141,.55)"; x.shadowBlur = 60; x.strokeStyle = "#FF4D8D"; x.lineWidth = 6;
  x.beginPath(); x.roundRect(90, 360, 900, 400, 36); x.stroke(); x.restore();
  x.fillStyle = "#EEF3F0"; x.font = '800 230px "Bricolage Grotesque", sans-serif';
  x.fillText(conNumero ? `${R.hallados} de ${R.sembrados}` : String(R.sembrados), 140, 610);
  x.font = '500 34px "IBM Plex Mono", monospace'; x.fillStyle = "#FF9BC0";
  x.fillText(conNumero ? "PROBLEMAS QUE ENCONTRÉ EN UNA APP" : "PROBLEMAS ESCONDIDOS EN UNA APP", 144, 700);
  // el reto
  x.fillStyle = "#FF4D8D"; x.font = '800 124px "Bricolage Grotesque", sans-serif';
  x.fillText("¿Cuántos", 90, 960); x.fillText("ves tú?", 90, 1090);
  x.fillStyle = "#A9B8B1"; x.font = '500 30px "IBM Plex Mono", monospace'; x.fillText(location.host + location.pathname.replace(/\/$/, ""), 90, 1270);
  try {
    const img = new Image(); img.src = "assets/logo.svg"; await img.decode();
    const w = 300, h = (img.naturalHeight / img.naturalWidth) * w; x.drawImage(img, W - 90 - w, 1270 - h + 8, w, h);
  } catch (e) { /* sin logo: la imagen sirve igual */ }
  return new Promise((ok) => c.toBlob((b) => ok(URL.createObjectURL(b)), "image/png"));
}
