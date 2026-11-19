// Mirada de auditor · medición propia: eventos del recorrido y resultado final. Sin cookies.
// El único dato personal es el correo, y solo si la persona pide su desglose.
import { CONFIG } from "./config.js";
import { VERSION } from "./instrumento.js";

const q = new URLSearchParams(location.search);
export const ORIGEN = (q.get("utm_source") || q.get("desde") || (q.has("reto") ? "reto" : "") || "directo").slice(0, 40);
// ?desde=paso0 (el enlace del Paso 0 en Skool) solo etiqueta el origen: la persona ve lo mismo que el resto,
// con el pedido de correo y la invitación a la comunidad (Anita, 19/11/2026).
// ?entrada=juego empieza directo en la primera pantalla (para anuncios).
export const ENTRADA_JUEGO = q.get("entrada") === "juego";
// ?primero=camino pone el camino y su precio antes del pedido de correo (para quienes ya están en la lista).
export const PRIMERO_CAMINO = q.get("primero") === "camino";
export const LOCAL = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

function sesion() {
  try {
    let s = sessionStorage.getItem("mirada-sesion");
    if (!s) { s = crypto.randomUUID(); sessionStorage.setItem("mirada-sesion", s); }
    return s;
  } catch (e) { return "sin-sesion"; }
}
function enviar(tabla, fila) {
  if (!CONFIG.supabaseUrl || LOCAL) return Promise.resolve(false); // en local no se mide: las pruebas no ensucian los números
  return fetch(`${CONFIG.supabaseUrl}/rest/v1/${tabla}`, {
    method: "POST", keepalive: true,
    headers: { apikey: CONFIG.supabaseKey, Authorization: `Bearer ${CONFIG.supabaseKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(fila),
  }).then((r) => r.ok).catch(() => false);
}
export function evento(nombre, extra = {}) {
  return enviar("auditor_eventos", { sesion: sesion(), nombre, extra, origen: ORIGEN, version: VERSION });
}
export function guardarResultado(R, S, tema) {
  return enviar("auditor_resultados", {
    sesion: sesion(), version: VERSION, origen: ORIGEN, nivel: R.nivel, salto: R.salto,
    puntos: R.puntos, hallados: R.hallados, falsas: R.falsas,
    respuestas: { marcas: S.marcas, criterios: S.criterios, orden: S.orden, decir: S.decir },
    perfil: S.perfil || {}, tema,
    segundos: Math.min(7200, Math.round((Date.now() - S.t0) / 1000)),
  });
}
// Pide los resultados completos por correo. La función guarda el correo y envía el enlace con Resend.
// El alta a Minuto UX se da solo si la persona marcó la casilla (newsletter = true).
// Devuelve "enviado", "sin-envio" (se guardó, pero el correo no salió), "invalido" o "sin-conectar".
export async function pedirDesglose(correo, codigo, R, newsletter = false) {
  if (!CONFIG.desgloseUrl || LOCAL) return "sin-conectar"; // en local no sale ningún correo
  const r = await fetch(CONFIG.desgloseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseKey, Authorization: `Bearer ${CONFIG.supabaseKey}` },
    body: JSON.stringify({ correo, codigo, newsletter: newsletter === true, sitio: location.origin + location.pathname, nivel: R.nivel, hallados: R.hallados, sesion: sesion(), origen: ORIGEN, version: VERSION }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 422) return "invalido";
  if (!r.ok) throw new Error("desglose " + r.status);
  return j.enviado ? "enviado" : "sin-envio";
}
