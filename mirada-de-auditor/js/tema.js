// Aspecto: sigue al sistema, con selector Auto / Claro / Oscuro en el pie.
const CLAVE = "mirada-tema";
const raiz = document.documentElement;
const claro = matchMedia("(prefers-color-scheme: light)");

export function temaElegido() { return raiz.dataset.tema === "claro" || raiz.dataset.tema === "oscuro" ? raiz.dataset.tema : "auto"; }
export function temaActual() { const t = temaElegido(); return t === "auto" ? (claro.matches ? "claro" : "oscuro") : t; }

function aplicar(t) {
  if (t === "auto") delete raiz.dataset.tema; else raiz.dataset.tema = t;
  try { if (t === "auto") localStorage.removeItem(CLAVE); else localStorage.setItem(CLAVE, t); } catch (e) { /* sin almacenamiento: vale para esta visita */ }
  pintar();
}
function pintar() {
  document.querySelectorAll("[data-tema-op]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.temaOp === temaElegido())));
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = temaActual() === "claro" ? "#EEF1EF" : "#0D1412";
}
document.querySelectorAll("[data-tema-op]").forEach((b) => b.addEventListener("click", () => aplicar(b.dataset.temaOp)));
claro.addEventListener("change", pintar);
pintar();
