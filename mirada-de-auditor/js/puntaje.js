// Mirada de auditor · puntuación (funciones puras, sin DOM).
import { PANTALLAS, ORDENAR, DECIR, MAXIMOS, TITULARES, TITULAR_CERO, TITULAR_DE_MAS, MARCAS_DE_MAS, RUTA, RUTA_JUNTA } from "./instrumento.js";

const PENA_FALSA = 0.5; // por cada marca sobre algo que funciona

// respuestas = {
//   marcas:   { [pantallaId]: [regionId, ...] }   // [] = "esta pantalla está bien"
//   criterios:{ [problemaId]: índiceDeOpciónElegida }  // índice sobre el orden original de instrumento.js.
//              El juego solo pregunta el criterio de los problemas que la persona marcó: nombrar exige haber visto.
//   orden:    ["A","B","C","D"]
//   decir:    { [itemId]: índice }
// }

export function revisarPantalla(pantalla, marcas = []) {
  const porRegion = Object.fromEntries(pantalla.regiones.map((r) => [r.id, r.problema || null]));
  const vistos = new Set();
  let falsas = 0;
  for (const id of marcas) {
    const p = porRegion[id];
    if (p) vistos.add(p);
    else falsas += 1;
  }
  const total = pantalla.problemas.length;
  return {
    vistos: [...vistos],
    escapados: pantalla.problemas.map((p) => p.id).filter((id) => !vistos.has(id)),
    falsas,
    total,
    limpiaBien: total === 0 && marcas.length === 0,
  };
}

export function revisarOrden(orden = []) {
  const pos = (id) => orden.indexOf(id);
  const completo = ORDENAR.items.every((i) => pos(i.id) >= 0);
  if (!completo) return { "a-primero": false, "b-antes-c": false, "d-despues": false };
  return {
    "a-primero": pos("A") === 0,
    "b-antes-c": pos("B") < pos("C"),
    "d-despues": pos("D") > pos("A") && pos("D") > pos("B"),
  };
}

const okIdx = (opciones) => opciones.findIndex((o) => o.ok);

export function puntuar(r) {
  const marcas = r.marcas || {};
  const criterios = r.criterios || {};
  let ver = 0, falsasVer = 0, ia = 0, falsasIa = 0, nombrar = 0, iaNombres = 0, vistosVer = 0;
  const detalle = {};

  for (const p of PANTALLAS) {
    const rev = revisarPantalla(p, marcas[p.id] || []);
    detalle[p.id] = rev;
    const nombres = p.problemas.filter((pr) => rev.vistos.includes(pr.id) && criterios[pr.id] === okIdx(pr.opciones)).length;
    if (p.acto === "ver") {
      ver += rev.vistos.length + (rev.limpiaBien ? 1 : 0);
      falsasVer += rev.falsas;
      vistosVer += rev.vistos.length;
      nombrar += nombres;
    } else {
      ia += rev.vistos.length;
      falsasIa += rev.falsas;
      iaNombres += nombres;
    }
  }
  ver = Math.max(0, ver - PENA_FALSA * falsasVer);
  ia = Math.max(0, ia - PENA_FALSA * falsasIa) + iaNombres;

  const ord = revisarOrden(r.orden);
  const ordenar = Object.values(ord).filter(Boolean).length;
  const decir = DECIR.filter((d) => (r.decir || {})[d.id] === okIdx(d.opciones)).length;

  const puntos = { ver, nombrar, ordenar, ia, decir };

  // Compuertas en el orden del camino: cada nivel exige el anterior.
  let nivel = "ves", salto = "certificar";
  if (ver < 3) salto = "ver";
  // Nombrar se mide sobre lo que vio: pasa con todos sus criterios bien, o con 3 de 4 si vio los cuatro.
  else if (nombrar < Math.ceil(0.75 * vistosVer)) salto = "nombrar";
  else {
    nivel = "nombras";
    if (ordenar < 2) salto = "ordenar";
    else {
      nivel = "ordenas";
      if (decir < 2) salto = "decir";
      else if (ia < 2) salto = "ia";
      else nivel = "defiendes";
    }
  }

  const banda = (acto) => {
    const f = puntos[acto] / MAXIMOS[acto];
    return f >= 0.75 ? "alto" : f >= 0.45 ? "medio" : "bajo";
  };
  const orden3 = { alto: 2, medio: 1, bajo: 0 };
  const filas = RUTA.map((b) => {
    if (b.fijo) return { pasos: b.pasos, desde: b.desde, hasta: b.hasta, banda: null, texto: b.fijo };
    // Un bloque medido por dos actos toma la banda más baja de los dos.
    const bd = b.mide.map(banda).sort((x, y) => orden3[x] - orden3[y])[0];
    return { pasos: b.pasos, desde: b.desde, hasta: b.hasta, banda: bd, texto: b[bd] };
  });
  // Las filas seguidas que la persona ya hace se juntan en una sola.
  const ruta = [];
  for (const f of filas) {
    const u = ruta[ruta.length - 1];
    if (f.banda === "alto" && u && u.banda === "alto") { u.hasta = f.hasta; u.pasos = `Pasos ${u.desde} a ${u.hasta}`; u.texto = RUTA_JUNTA; }
    else ruta.push({ ...f });
  }
  // Dónde empieza: el primer bloque que todavía no hace; si los hace todos, la certificación.
  const empiezaEn = (ruta.find((b) => b.banda && b.banda !== "alto") || ruta[ruta.length - 1]).pasos;

  const hallados = Object.values(detalle).reduce((n, d) => n + d.vistos.length, 0);
  const sembrados = PANTALLAS.reduce((n, p) => n + p.problemas.length, 0);

  const falsas = falsasVer + falsasIa;
  const titular = hallados === 0 ? TITULAR_CERO
    : salto === "ver" && falsas >= MARCAS_DE_MAS ? TITULAR_DE_MAS(hallados, falsas)
    : TITULARES[`${nivel}/${salto}`];
  return {
    puntos, maximos: MAXIMOS, nivel, salto, titular,
    ruta, empiezaEn, detalle, orden: ord, hallados, sembrados,
    falsas,
  };
}
