// Mirada de auditor · motor del juego.
// Regla (Anita, 19/11/2026): jugar y avanzar. Nada corrige ni explica en el camino;
// qué estaba bien y qué no se ve en el desglose, que llega por correo.
import { ENCARGO, PANTALLAS, ORDENAR, DECIR, MARCAS_MAX, VERSION, PERFIL, NOMBRE, PORTADA } from "./instrumento.js";
import { PANTALLA_HTML } from "./pantallas.js";
import { mostrarResultado, mostrarDesglose, leerEnlace } from "./resultado.js";
import { evento, ENTRADA_JUEGO } from "./datos.js";
import { ic, esc } from "./util.js";

const PASOS = [
  { t: "portada" },
  { t: "mensaje" },
  { t: "pantalla", id: "foto" },
  { t: "perfil", i: 0 },
  { t: "pantalla", id: "zona" },
  { t: "pantalla", id: "revisar" },
  { t: "perfil", i: 1 },
  { t: "ordenar" },
  { t: "perfil", i: 2 },
  { t: "pantalla", id: "ia" },
  { t: "decir", i: 0 },
  { t: "perfil", i: 3 }, // la última pregunta personal va antes del último paso: el juego termina con el progreso completo
  { t: "decir", i: 1 },
];
const PRIMERO = PASOS.findIndex((p) => p.t === "pantalla");
const CLAVE = "mirada-v" + VERSION;
const main = document.getElementById("app");
const vivo = document.getElementById("vivo");
const aviso = document.getElementById("aviso");
const prog = document.getElementById("prog");
const sinMov = matchMedia("(prefers-reduced-motion: reduce)");
const angosto = matchMedia("(max-width: 56.24rem)");

let S = nuevo();
function nuevo() {
  // Con ?entrada=juego (anuncios) se empieza directo en la primera pantalla.
  return { v: VERSION, paso: ENTRADA_JUEGO ? PRIMERO : 0, fase: "marcar", q: 0, marcas: {}, criterios: {}, orden: [...ORDENAR.inicial], decir: {}, perfil: {}, mez: {}, t0: Date.now(), inicio: false, fin: false };
}
function guardar() { try { sessionStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: el juego sigue */ } }
function cargar() { try { const s = JSON.parse(sessionStorage.getItem(CLAVE)); if (s && s.v === VERSION) S = s; } catch (e) { /* estado ilegible: se empieza de cero */ } }

// ---------- utilidades ----------
let tAviso;
function avisar(texto, visible = true) {
  vivo.textContent = ""; requestAnimationFrame(() => { vivo.textContent = texto; });
  if (!visible) return;
  aviso.textContent = texto; aviso.classList.add("on");
  clearTimeout(tAviso); tAviso = setTimeout(() => aviso.classList.remove("on"), 2600);
}
function mezcla(id, n) {
  if (!S.mez[id]) { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } S.mez[id] = a; guardar(); }
  return S.mez[id];
}
// Progreso por segmentos, arriba y sin texto: uno por cada paso del juego, para saber cuántos son.
// Las preguntas personales no suman segmento y ahí se oculta: va solo la pregunta.
const CUENTAN = PASOS.map((p, i) => i).filter((i) => i >= PRIMERO && PASOS[i].t !== "perfil");
function pintarProgreso() {
  if (S.paso < PRIMERO || S.paso >= PASOS.length) { prog.hidden = true; return; }
  const enPerfil = PASOS[S.paso].t === "perfil", total = CUENTAN.length, hechos = CUENTAN.filter((i) => i < S.paso).length;
  prog.hidden = false; prog.classList.toggle("oculto", enPerfil);
  if (prog.querySelectorAll("i").length !== total) prog.innerHTML = `<span class="sr" id="prog-t"></span>` + `<i aria-hidden="true"><b></b></i>`.repeat(total);
  prog.querySelector("#prog-t").textContent = `Paso ${Math.min(hechos + 1, total)} de ${total}`;
  // Hechos: llenos. El paso en curso: empezado. El resto: vacío.
  prog.querySelectorAll("b").forEach((b, i) => { b.style.transform = `scaleX(${i < hechos ? 1 : i === hechos && !enPerfil ? 0.4 : 0})`; });
}
// Consigna en dos pesos: el contexto va liviano y la pregunta, fuerte.
function consignaHTML(o) {
  const contexto = (ENTRADA_JUEGO && o.contextoAnuncio) || o.contexto;
  return `<h1 class="consigna" id="consigna">${contexto ? `<span class="antes">${contexto}</span> ` : ""}<span class="grande">${o.consigna}</span></h1>`;
}
// El recorrido de 100 personas, dibujado: la caída se ve antes de leerla.
function embudoHTML() {
  const e = ORDENAR.embudo, max = e.pasos[0].n;
  const frase = `${e.titulo} ${e.pasos.slice(1).map((p) => `${p.n} ${p.t.toLowerCase()}`).join(", ")}.`;
  return `<div class="embudo" role="img" aria-label="${esc(frase)}"><p>${e.titulo}</p><div class="e-barras">${e.pasos.map((p) => `<div><b>${p.n}</b><i style="--h:${(p.n / max).toFixed(2)}"></i><span>${p.t}</span></div>`).join("")}</div></div>`;
}
function escalar() {
  const ancho = Math.min(window.innerWidth, 1248) - 32;
  let k;
  if (angosto.matches) k = Math.min(1, ancho / 390);
  else k = Math.max(0.62, Math.min(1, (window.innerHeight - 150) / 640));
  document.documentElement.style.setProperty("--k", k.toFixed(4));
  return k;
}
function enfocar(el) { if (!el) return; el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
function arriba() { window.scrollTo({ top: 0, behavior: sinMov.matches ? "auto" : "smooth" }); }
// Las opciones llevan la señal de un botón de radio: se elige una, y al elegirla el juego sigue.
// Tras elegir, la opción se marca un instante y el juego sigue solo.
function alElegir(boton, seguir) {
  boton.closest(".ops").querySelectorAll(".op").forEach((b) => { b.disabled = true; });
  boton.classList.add("elegida");
  setTimeout(seguir, sinMov.matches ? 0 : 320);
}

// ---------- flujo ----------
// Guardia contra el segundo toque a ciegas: una respuesta no se acepta en el primer instante de una pantalla nueva
// (solo con puntero; con teclado, detail es 0 y pasa).
let tPintado = 0;
main.addEventListener("click", (e) => {
  if (e.detail > 0 && performance.now() - tPintado < 450 && e.target.closest(".op, .sino button")) { e.stopPropagation(); e.preventDefault(); }
}, true);
// El segmento del paso en curso avanza dentro de la pantalla (0 a 1).
function avanzarSegmento(f) {
  const b = prog.querySelectorAll("b")[CUENTAN.filter((i) => i < S.paso).length];
  if (b) b.style.transform = `scaleX(${Math.min(1, f).toFixed(2)})`;
}
function pintar(conFoco = true) {
  guardar(); clearTimeout(tAviso); aviso.classList.remove("on"); vivo.textContent = ""; // un aviso no sigue a la pantalla siguiente
  tPintado = performance.now();
  if (S.paso >= PASOS.length) return terminar();
  const p = PASOS[S.paso];
  if (p.t === "portada") pintarPortada(conFoco);
  else if (p.t === "mensaje") pintarMensaje(conFoco);
  else if (p.t === "pantalla") pintarPantalla(PANTALLAS.find((x) => x.id === p.id), conFoco);
  else if (p.t === "perfil") pintarPerfil(p.i, conFoco);
  else if (p.t === "ordenar") pintarOrdenar(conFoco);
  else pintarDecir(p.i, conFoco);
  pintarProgreso();
}
function siguiente() {
  const ps = PASOS[S.paso];
  evento("paso", { paso: S.paso, id: ps.id || ps.t + (ps.i ?? ""), ...(ps.t === "perfil" ? { si: S.perfil[PERFIL[ps.i].id] } : {}) });
  S.paso += 1; S.fase = "marcar"; S.q = 0; arriba(); pintar();
}
function repetir() { S = nuevo(); guardar(); history.replaceState(null, "", location.pathname + location.search.replace(/[?&]vista\b/, "")); arriba(); pintar(); }
function terminar() {
  // El resultado se guarda y se mide una sola vez, aunque la persona vuelva a cargar la página.
  const primeraVez = !S.fin; S.fin = true;
  if (S.segundos == null) S.segundos = Math.round((Date.now() - S.t0) / 1000); // fija el enlace del resultado
  guardar(); prog.hidden = true;
  mostrarResultado(main, S, { propio: true, medir: primeraVez, alRepetir: repetir });
}

// ---------- portada ----------
function pintarPortada(conFoco) {
  main.innerHTML = `
  <section class="portada" data-paso="portada" aria-labelledby="consigna">
    <div class="p-texto">
      <p class="mono">${PORTADA.sobre}</p>
      <h1 class="marca" id="consigna">${NOMBRE}</h1>
      <p class="lead">${PORTADA.bajada}</p>
      <p class="promesa">${PORTADA.promesa}</p>
      <div><button class="btn p grande" id="empezar">${PORTADA.boton}${ic("flecha")}</button></div>
    </div>
    <div class="p-visual" aria-hidden="true"><div class="maqueta"><i class="m-bar"></i><i class="m-fila"></i><i class="m-fila"></i><i class="m-fila"></i><i class="m-btn"></i><span class="m-lente"></span></div></div>
  </section>`;
  main.querySelector("#empezar").addEventListener("click", siguiente);
  if (conFoco) enfocar(main.querySelector("#consigna"));
}

// ---------- el mensaje de Sofía ----------
// Llega como un chat: alguien escribe, aparecen los mensajes y el botón es la respuesta.
// Todo el texto está en la página desde el principio (el lector de pantalla lo lee completo); lo que se anima es la vista.
function pintarMensaje(conFoco) {
  const quieto = sinMov.matches;
  main.innerHTML = `
  <section class="chat" data-paso="mensaje" aria-labelledby="consigna">
    <h1 class="sr" id="consigna">Mensaje de ${ENCARGO.de}, ${ENCARGO.rol}: ${ENCARGO.mensajes.join(" ")}</h1>
    <div class="chat-caja">
      <header aria-hidden="true"><span class="av">${ENCARGO.de[0]}</span><p><b>${ENCARGO.de}</b><small>${ENCARGO.rol}</small></p></header>
      <ol class="hilo" aria-hidden="true">
        ${ENCARGO.mensajes.map((m) => `<li class="burbuja${quieto ? "" : " espera"}">${m}</li>`).join("")}
        <li class="escribe${quieto ? " espera" : ""}"><i></i><i></i><i></i></li>
      </ol>
      <div class="chat-resp${quieto ? "" : " espera"}"><button class="btn p grande" id="responder">${ENCARGO.responder}${ic("flecha")}</button></div>
    </div>
  </section>`;
  const caja = main.querySelector(".chat-caja"), burbujas = [...caja.querySelectorAll(".burbuja")], escribe = caja.querySelector(".escribe"), resp = caja.querySelector(".chat-resp");
  if (!quieto) {
    // Alguien escribe, llega un mensaje, vuelve a escribir, llega el otro, y aparece la respuesta.
    burbujas.forEach((b, i) => setTimeout(() => {
      if (!document.body.contains(b)) return;
      b.classList.remove("espera");
      if (i === burbujas.length - 1) { escribe.classList.add("espera"); setTimeout(() => resp.classList.remove("espera"), 350); }
    }, 600 + i * 1000));
  }
  main.querySelector("#responder").addEventListener("click", siguiente);
  if (conFoco) enfocar(main.querySelector("#consigna"));
}

// ---------- pantallas de Patitas ----------
function pintarPantalla(p, conFoco) {
  main.innerHTML = `
  <section class="escena con-barra" data-paso="${p.id}" aria-labelledby="consigna">
    <div class="texto">${consignaHTML(p)}${p.ayuda ? `<p class="ayuda" id="ayuda">${p.ayuda}</p>` : ""}</div>
    <div class="obj"><div class="tel" id="tel"><div class="scr marcando" id="scr" role="group" aria-label="Pantalla de Patitas: ${esc(p.nombre)}">${PANTALLA_HTML[p.id]}<div class="lente" id="lente" aria-hidden="true"></div></div></div></div>
    <div class="panel" id="panel"></div>
    <div class="acc" id="acc">
      <p class="sigue" id="sigue" hidden>${ic("baja")}Desliza: la pantalla sigue</p>
      <button class="btn s" id="listo">Listo</button>
      <button class="btn s" id="bien">Nada que marcar</button>
    </div>
  </section>`;
  escalar();
  const scr = main.querySelector("#scr");
  const marcas = () => (S.marcas[p.id] || (S.marcas[p.id] = []));
  scr.querySelectorAll("[data-r]").forEach((el) => {
    const reg = p.regiones.find((r) => r.id === el.dataset.r);
    el.setAttribute("role", "button"); el.tabIndex = 0;
    el.setAttribute("aria-label", reg.etiqueta); el.setAttribute("aria-pressed", "false");
  });
  const listo = main.querySelector("#listo"), bien = main.querySelector("#bien");
  function pintarMarcas() {
    const m = S.marcas[p.id] || [];
    // «Listo» toma el color de acción recién cuando hay algo marcado.
    listo.classList.toggle("p", m.length > 0); listo.classList.toggle("s", m.length === 0);
    scr.querySelectorAll("[data-r]").forEach((el) => {
      const i = m.indexOf(el.dataset.r);
      el.setAttribute("aria-pressed", i >= 0 ? "true" : "false");
      el.querySelector(":scope > .pin")?.remove();
      if (i >= 0) el.insertAdjacentHTML("beforeend", `<span class="pin" aria-hidden="true">${i + 1}</span>`);
    });
  }
  function alternar(el) {
    if (S.fase !== "marcar") return;
    const m = marcas(), id = el.dataset.r, i = m.indexOf(id);
    if (i >= 0) { m.splice(i, 1); avisar(`Marca quitada. Quedan ${m.length} de ${MARCAS_MAX}.`, false); }
    else if (m.length >= MARCAS_MAX) return avisar(`Máximo ${MARCAS_MAX} marcas. Toca una para quitarla.`);
    else { m.push(id); avisar(`Marca ${m.length} de ${MARCAS_MAX}.`, false); }
    if (!S.inicio) { S.inicio = true; evento("inicio"); }
    guardar(); pintarMarcas();
  }
  scr.addEventListener("click", (e) => { const el = e.target.closest("[data-r]"); if (el) alternar(el); });
  scr.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest("[data-r]"); if (!el) return;
    e.preventDefault(); alternar(el);
  });
  // Los dos botones quedan activos: si falta algo, lo dicen al tocarlos.
  listo.addEventListener("click", () => (marcas().length ? preguntar(p) : avisar("Toca lo que falla, o elige «Nada que marcar».")));
  bien.addEventListener("click", () => {
    if (marcas().length) return avisar("Quita tus marcas para elegir «Nada que marcar».");
    S.marcas[p.id] = []; if (!S.inicio) { S.inicio = true; evento("inicio"); } preguntar(p);
  });
  // En el celular: avisa que la pantalla sigue debajo de la barra fija, hasta que se ve completa.
  const sigue = main.querySelector("#sigue"), tel = main.querySelector("#tel"), acc = main.querySelector("#acc");
  const verSigue = () => {
    if (!document.body.contains(sigue)) return removeEventListener("scroll", verSigue);
    sigue.hidden = !angosto.matches || S.fase !== "marcar" || tel.getBoundingClientRect().bottom <= acc.getBoundingClientRect().top + sigue.offsetHeight + 8;
  };
  addEventListener("scroll", verSigue, { passive: true }); requestAnimationFrame(verSigue);

  pintarMarcas();
  if (S.fase === "lente") preguntar(p, true);
  else if (conFoco) enfocar(main.querySelector("#consigna"));
}

function rectDe(el, scr, margen = 7) {
  const k = scr.getBoundingClientRect().width / 390, a = el.getBoundingClientRect(), b = scr.getBoundingClientRect();
  const x = Math.max(4, (a.left - b.left) / k - margen), y = Math.max(4, (a.top - b.top) / k - margen);
  const w = Math.min(390 - 4 - x, a.width / k + margen * 2), h = Math.min(640 - 4 - y, a.height / k + margen * 2);
  return { x, y, w, h };
}
function moverLente(lente, r) {
  const prev = lente._r || { x: 0, y: 0, w: 390, h: 640 };
  Object.assign(lente.style, { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" });
  if (!sinMov.matches) {
    lente.style.transition = "none"; lente.style.transformOrigin = "0 0";
    lente.style.transform = `translate(${prev.x - r.x}px,${prev.y - r.y}px) scale(${prev.w / r.w},${prev.h / r.h})`;
    lente.getBoundingClientRect();
    lente.style.transition = ""; lente.style.transform = "none";
  }
  lente._r = r; lente.classList.add("on");
}
function ventana(scr, tel, r) {
  // En el celular, la pantalla se recorta a una ventana que viaja hasta lo que se pregunta.
  if (!angosto.matches || !r) { tel.classList.remove("ventana"); scr.style.translate = ""; return; }
  const k = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--k")) || 1;
  const alto = Math.round(Math.min(640 * k, Math.max(150, Math.min(window.innerHeight * 0.34, r.h * k + 130))));
  tel.style.setProperty("--ventana", alto + "px"); tel.classList.add("ventana");
  const cy = (r.y + r.h / 2) * k;
  const ty = Math.min(0, Math.max(alto - 640 * k, alto / 2 - cy));
  scr.style.translate = `0 ${ty}px`;
}

// La lente se posa en cada problema que la persona marcó y pregunta por qué lo es. Al elegir, sigue.
// Por lo que no marcó no se pregunta (Anita, 19/11/2026): preguntarlo le mostraba lo que se le había escapado.
function preguntar(p, restaurar = false) {
  const marcadas = S.marcas[p.id] || [];
  const lista = p.problemas.filter((pr) => p.regiones.some((r) => r.problema === pr.id && marcadas.includes(r.id)));
  if (!lista.length) return siguiente();
  S.fase = "lente"; if (!restaurar) S.q = 0; guardar();
  const scr = main.querySelector("#scr"), tel = main.querySelector("#tel"), lente = main.querySelector("#lente"), panel = main.querySelector("#panel");
  scr.classList.remove("marcando"); scr.classList.add("revelando");
  scr.querySelectorAll("[data-r]").forEach((el) => { el.tabIndex = -1; el.setAttribute("aria-disabled", "true"); });
  main.querySelector("#acc").hidden = true;
  main.querySelector(".escena").classList.add("lenteando");

  const mostrar = (q) => {
    S.q = q; guardar(); tPintado = performance.now(); avanzarSegmento(0.4 + 0.6 * q / lista.length);
    const pr = lista[q];
    const obj = scr.querySelector(`[data-lente="${pr.id}"]`) || scr.querySelector(`[data-r="${p.regiones.find((r) => r.problema === pr.id).id}"]`);
    const r = rectDe(obj, scr);
    ventana(scr, tel, r); moverLente(lente, r);
    const perm = mezcla(pr.id, pr.opciones.length);
    panel.innerHTML = `<div class="entra" style="display:flex;flex-direction:column;gap:1rem">
      <h2 class="preg" id="foco">${pr.pregunta}</h2>
      <ul class="ops">${perm.map((i) => `<li><button class="op" data-i="${i}"><span class="radio" aria-hidden="true"></span><span>${esc(pr.opciones[i].t)}</span></button></li>`).join("")}</ul></div>`;
    panel.querySelectorAll(".op").forEach((b) => b.addEventListener("click", () => {
      S.criterios[pr.id] = +b.dataset.i; guardar();
      alElegir(b, () => (q === lista.length - 1 ? siguiente() : mostrar(q + 1)));
    }));
    enfocar(panel.querySelector("#foco"));
    if (angosto.matches) window.scrollTo({ top: Math.max(0, tel.getBoundingClientRect().top + window.scrollY - 12), behavior: sinMov.matches ? "auto" : "smooth" });
  };
  mostrar(restaurar ? Math.min(S.q, lista.length - 1) : 0);
}

// ---------- preguntas personales: solo la pregunta ----------
function pintarPerfil(i, conFoco) {
  const q = PERFIL[i];
  main.innerHTML = `
  <section class="solo perfil" data-paso="perfil${i}" aria-labelledby="consigna">
    <h1 class="consigna" id="consigna">${q.pregunta}</h1>
    <div class="sino"><button class="btn s grande" data-v="si">Sí</button><button class="btn s grande" data-v="no">No</button></div>
  </section>`;
  main.querySelectorAll(".sino button").forEach((b) => b.addEventListener("click", () => { S.perfil[q.id] = b.dataset.v === "si"; siguiente(); }));
  if (conFoco) enfocar(main.querySelector("#consigna"));
}

// ---------- ordenar ----------
// Se arrastra (ratón: toda la tarjeta; táctil: desde el agarre, para no pelear con el desplazamiento).
// Sin arrastrar: tocar una tarjeta y después el lugar donde va. Con teclado: aparecen las flechas al llegar con Tab.
function pintarOrdenar(conFoco) {
  const item = (id) => ORDENAR.items.find((x) => x.id === id);
  main.innerHTML = `
  <section class="solo" data-paso="ordenar" aria-labelledby="consigna">
    ${consignaHTML(ORDENAR)}
    ${embudoHTML()}
    <p class="ayuda" id="ayuda">${ORDENAR.ayuda}</p>
    <ol class="orden" id="orden" aria-label="Hallazgos, del que se arregla primero al último">${S.orden.map((id) => `<li data-id="${id}"><b>${item(id).t}</b><small>${item(id).d}</small><span class="grip" aria-hidden="true">${ic("agarre")}</span><span class="mov"><button data-d="-1" aria-label="Subir: ${esc(item(id).t)}">${ic("sube")}</button><button data-d="1" aria-label="Bajar: ${esc(item(id).t)}">${ic("baja")}</button></span></li>`).join("")}</ol>
    <div><button class="btn p" id="listo">Listo</button></div>
  </section>`;
  const ol = main.querySelector("#orden");
  const lugar = (li) => [...ol.children].indexOf(li) + 1;
  const sincronizar = () => {
    S.orden = [...ol.children].map((li) => li.dataset.id); guardar();
    [...ol.children].forEach((li, i) => { li.querySelector('[data-d="-1"]').setAttribute("aria-disabled", i === 0); li.querySelector('[data-d="1"]').setAttribute("aria-disabled", i === ol.children.length - 1); });
  };
  const decir = (li) => avisar(`${item(li.dataset.id).t}: ahora en el lugar ${lugar(li)} de 4.`, false);
  sincronizar();
  // Teclado
  ol.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-d]"); if (!b) return;
    const li = b.closest("li"), d = +b.dataset.d, otro = d < 0 ? li.previousElementSibling : li.nextElementSibling;
    // En el borde el botón no se desactiva (perdería el foco): avisa y se queda donde está.
    if (!otro) return avisar(d < 0 ? "Ya está en el primer lugar." : "Ya está en el último lugar.");
    if (d < 0) ol.insertBefore(li, otro); else ol.insertBefore(otro, li);
    sincronizar(); decir(li);
    li.querySelector(`[data-d="${d}"]`).focus();
  });
  // Arrastre y toque
  let li = null, y0 = 0, movido = false, toque = null, elegida = null;
  const soltarSeleccion = () => { elegida?.classList.remove("sel"); elegida = null; };
  ol.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    const el = e.target.closest("li"); if (!el) return;
    toque = { el, x: e.clientX, y: e.clientY };
    if (e.pointerType === "touch" && !e.target.closest(".grip")) return; // en táctil, el resto de la tarjeta deja desplazar la página
    li = el; y0 = e.clientY; movido = false; li.setPointerCapture(e.pointerId); e.preventDefault();
  });
  ol.addEventListener("pointermove", (e) => {
    if (!li) return;
    const dy = e.clientY - y0;
    if (!movido) { if (Math.abs(dy) < 5) return; movido = true; soltarSeleccion(); li.classList.add("arrastra"); }
    li.style.transform = `translateY(${dy}px)`;
    const otro = dy < 0 ? li.previousElementSibling : li.nextElementSibling; if (!otro) return;
    const r = otro.getBoundingClientRect(), medio = r.top + r.height / 2;
    if ((dy < 0 && e.clientY < medio) || (dy > 0 && e.clientY > medio)) {
      li.style.transform = ""; const antes = li.getBoundingClientRect().top;
      if (dy < 0) ol.insertBefore(otro, li.nextSibling); else ol.insertBefore(otro, li);
      y0 += li.getBoundingClientRect().top - antes; li.style.transform = `translateY(${e.clientY - y0}px)`;
    }
  });
  const tocar = (el) => {
    if (!elegida) { elegida = el; el.classList.add("sel"); return avisar("Ahora toca el lugar donde va."); }
    if (elegida === el) return soltarSeleccion();
    const m = elegida; soltarSeleccion();
    if (lugar(m) < lugar(el)) ol.insertBefore(m, el.nextSibling); else ol.insertBefore(m, el);
    sincronizar(); decir(m);
  };
  const soltar = (e) => {
    const arrastro = li && movido;
    if (li) { li.style.transform = ""; li.classList.remove("arrastra"); if (arrastro) { sincronizar(); decir(li); } li = null; }
    if (!arrastro && toque && e.type === "pointerup" && Math.hypot(e.clientX - toque.x, e.clientY - toque.y) < 8) tocar(toque.el);
    toque = null;
  };
  ol.addEventListener("pointerup", soltar); ol.addEventListener("pointercancel", soltar);
  main.querySelector("#listo").addEventListener("click", siguiente);
  if (conFoco) enfocar(main.querySelector("#consigna"));
}

// ---------- decir ----------
function pintarDecir(i, conFoco) {
  const d = DECIR[i], perm = mezcla("decir-" + d.id, d.opciones.length);
  main.innerHTML = `
  <section class="solo" data-paso="decir${i}" aria-labelledby="consigna">
    ${consignaHTML(d)}
    ${i === 0 ? embudoHTML() : ""}
    <ul class="ops">${perm.map((j) => `<li><button class="op" data-i="${j}"><span class="radio" aria-hidden="true"></span><span>${esc(d.opciones[j].t)}</span></button></li>`).join("")}</ul>
  </section>`;
  main.querySelectorAll(".op").forEach((b) => b.addEventListener("click", () => { S.decir[d.id] = +b.dataset.i; guardar(); alElegir(b, siguiente); }));
  if (conFoco) enfocar(main.querySelector("#consigna"));
}

// ---------- arranque ----------
window.addEventListener("resize", () => { escalar(); });
window.addEventListener("hashchange", () => location.reload()); // abrir un resultado o un desglose desde un enlace de la misma página
history.scrollRestoration = "manual"; // al abrir el resultado o los resultados completos, la página empieza arriba
const enlace = leerEnlace();
// ¿El enlace es de la partida propia? Se compara lo jugado, no la dirección.
const huella = (x) => JSON.stringify([PANTALLAS.map((p) => (x.marcas?.[p.id] || []).join(",")), PANTALLAS.flatMap((p) => p.problemas.map((pr) => x.criterios?.[pr.id] ?? "")), (x.orden || []).join(""), DECIR.map((d) => x.decir?.[d.id] ?? "")]);
const vista = new URLSearchParams(location.search).has("vista");
cargar();
if (ENTRADA_JUEGO && S.paso < PRIMERO) S.paso = PRIMERO; // quien llega desde un anuncio empieza en la primera pantalla
if (enlace && enlace.modo === "d") {
  // Desglose: se abre desde el correo. Con ?vista no mide (para revisar los desgloses posibles).
  prog.hidden = true;
  if (!vista) evento("desglose_abierto");
  mostrarDesglose(main, enlace, { alRepetir: repetir });
} else if (enlace && vista) {
  // Vista previa de un resultado posible, tal como lo ve quien jugó. No guarda ni mide.
  prog.hidden = true;
  mostrarResultado(main, enlace, { propio: true, previa: true, alRepetir: repetir });
} else if (enlace && S.paso >= PASOS.length && huella(enlace) === huella(S)) {
  terminar(); // es su propio resultado: volvió a cargar la página
} else if (enlace) {
  // Resultado de otra persona. La partida propia no se toca: «Jugar» la sigue, o empieza una nueva si ya terminó.
  evento("visita_enlace");
  prog.hidden = true;
  mostrarResultado(main, enlace, { propio: false, alRepetir: () => { if (S.paso >= PASOS.length) return repetir(); history.replaceState(null, "", location.pathname + location.search); arriba(); pintar(); } });
} else {
  evento("visita");
  pintar(false);
}
