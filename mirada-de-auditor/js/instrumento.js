// Mirada de auditor · instrumento (fuente única de verdad).
// De aquí salen el juego, la puntuación, la simulación y docs/instrumento.md.
// Caso: Patitas · Alerta de mascota perdida (parte reservada para el diagnóstico: ninguna práctica del camino la usa).
// Regla de las opciones (auditoría en frío, 18/11/2026): cada opción falsa aplica otro criterio verosímil
// y tiene un largo parecido a la correcta. La nota dice por qué ese criterio no aplica en esta pantalla.
// Segunda pasada (prueba a ciegas): las cuatro opciones de cada pregunta tienen la misma forma y describen hechos;
// ninguna usa «debería», «nunca» ni «siempre», y ninguna es la única con un término técnico.

// Versión PÚBLICA. La 1.0 es la que salió al público el 19/11/2026.
// En el proceso interno de diseño esa misma versión se llamó 3.6 (ver README, «Versiones»).
export const VERSION = "1.0";

export const NOMBRE = "Mirada de auditor";

// Regla de texto (Anita, 19/11/2026): el mínimo posible. No se dice lo que no es importante.
// El juego es tocar y avanzar: las respuestas correctas no se muestran al jugar, van en el desglose.
export const PORTADA = {
  sobre: "Simulación de auditoría UX/UI",
  // Dos pesos: la tarea va fuerte y la promesa, más liviana.
  bajada: "Revisa una app y dile al equipo qué cambiar primero.",
  promesa: "Descubre qué tan cerca estás de cobrar por hacerlo.",
  boton: "Empezar",
};

// El caso llega como un mensaje de chat. El botón es la respuesta de la persona.
export const ENCARGO = {
  de: "Sofía",
  rol: "Líder de producto de Patitas",
  mensajes: [
    "Lanzamos la alerta de mascota perdida.",
    "De cada 10 personas que la empiezan, solo 2 la publican. ¿La miras?",
  ],
  responder: "La miro",
};

// Cada pantalla tiene regiones marcables. Una región puede pertenecer a un problema sembrado.
// "etiqueta" es lo que oye una persona con lector de pantalla: describe también lo visual que hace falta para juzgar.
// "contexto" va liviano y "consigna" (la pregunta) va fuerte: dos pesos, para que no todo pese igual.
// Quien usa Patitas es «la usuaria», sin nombre propio (Anita, 19/11/2026): con Sofía, Luna y un nombre más, nadie se acordaba de quién era quién.
// El contexto dice quién hace la tarea («la usuaria tiene que marcar la zona»), para que no parezca una orden a quien juega.
export const PANTALLAS = [
  {
    id: "foto",
    acto: "ver",
    nombre: "Alerta de mascota perdida - Foto y contacto",
    contexto: "Una usuaria perdió a su gata y quiere publicar la alerta.",
    // Quien llega desde un anuncio no vio el mensaje de Sofía: el encargo va en la primera consigna.
    contextoAnuncio: "Patitas lanzó la alerta de mascota perdida y solo 2 de cada 10 personas la publican. Una usuaria perdió a su gata y quiere publicarla.",
    consigna: "¿Qué la frena en esta pantalla?",
    ayuda: "Toca hasta 3 fallas. Marcar algo que funciona resta.",
    regiones: [
      { id: "foto-barra", etiqueta: "Barra superior: flecha para volver y título «Alerta de mascota perdida»" },
      { id: "foto-pasos", etiqueta: "Indicador: paso 1 de 3, Foto y contacto" },
      { id: "foto-mascota", etiqueta: "Tarjeta de Luna: gata gris, 3 años, vista hoy a las 18:40" },
      { id: "foto-archivo", problema: "error-codigo", etiqueta: "Foto de Luna: archivo IMG_2291.HEIC con borde rojo, mensaje «Error: upload_failed (415)» y enlace «Reintentar»" },
      { id: "foto-telefono", etiqueta: "Teléfono de contacto: 600 000 000. Ayuda: «Solo lo ve quien toque Vi a esta mascota»" },
      { id: "foto-boton", problema: "boton-apagado", etiqueta: "Botón «Continuar», apagado en gris. La pantalla no muestra ningún otro mensaje" },
    ],
    problemas: [
      {
        id: "error-codigo",
        titulo: "El error habla en código",
        que: "Al subir la foto aparece «Error: upload_failed (415)». El mensaje no dice qué pasó ni qué hacer, y «Reintentar» vuelve a fallar.",
        donde: "Alerta de mascota perdida - Foto y contacto, campo «Foto de Luna».",
        criterio: "Los errores se escriben en lenguaje humano: qué pasó y cómo resolverlo (heurística 9 de Nielsen).",
        porque: "El celular de la usuaria guarda las fotos en un formato que Patitas no acepta. Ella no puede saberlo, y la alerta se queda sin foto en el momento en que más la necesita.",
        severidad: "alta",
        pregunta: "¿Por qué el aviso de la foto es un problema?",
        opciones: [
          { t: "El aviso no explica qué pasó ni cómo puede resolverlo la usuaria", ok: true },
          { t: "El aviso no usa texto ni borde: marca el error solo con el rojo", nota: "Además del rojo hay un texto y un borde. Lo que falla es lo que dice ese texto." },
          { t: "El aviso no aparece junto al campo ni cerca de la foto elegida", nota: "Aparece dentro del campo de la foto. El problema está en su mensaje." },
          { t: "El aviso no separa el nombre del archivo ni lo distingue del error", nota: "Van en dos líneas y con dos colores. El problema está en lo que dice el error." },
        ],
      },
      {
        id: "boton-apagado",
        titulo: "El botón está apagado y nada dice por qué",
        que: "«Continuar» aparece en gris y no responde. La pantalla no indica qué falta para activarlo.",
        donde: "Alerta de mascota perdida - Foto y contacto, botón «Continuar».",
        criterio: "El sistema informa su estado y qué necesita para avanzar (heurística 1 de Nielsen).",
        porque: "La alerta no avanza sin foto, pero la usuaria no lo sabe. Cree que la app se rompió y sale a buscar a Luna sin publicar.",
        severidad: "alta",
        pregunta: "¿Por qué el botón «Continuar» es un problema?",
        opciones: [
          { t: "El botón está apagado y nada en la pantalla dice qué le falta", ok: true },
          { t: "El botón está apagado y su gris no alcanza el contraste mínimo", nota: "A un control apagado no se le exige contraste: la norma lo exceptúa. Lo que falta es decir por qué está apagado." },
          { t: "El botón está apagado y queda lejos del campo que la usuaria tocó", nota: "Abajo es donde se espera el botón para avanzar. El problema es que nadie explica por qué no responde." },
          { t: "El botón está apagado y su texto no anticipa el paso siguiente", nota: "El indicador de arriba ya dice que es el paso 1 de 3. El problema es otro." },
        ],
      },
    ],
  },
  {
    id: "zona",
    acto: "ver",
    nombre: "Alerta de mascota perdida - Zona",
    contexto: "Ahora la usuaria tiene que marcar la zona.",
    consigna: "¿Qué la frena en esta pantalla?",
    ayuda: "Toca hasta 3 fallas.",
    regiones: [
      { id: "zona-barra", etiqueta: "Barra superior: flecha para volver y título «Alerta de mascota perdida»" },
      { id: "zona-pasos", etiqueta: "Indicador: paso 2 de 3, Zona" },
      { id: "zona-pregunta", etiqueta: "Título: «¿Dónde viste a Luna por última vez?»" },
      { id: "zona-mapa", etiqueta: "Mapa con un pin sobre el Parque Centenario y un círculo que marca el alcance" },
      { id: "zona-instruccion", problema: "contraste", etiqueta: "Instrucción pegada debajo del mapa, en letra chica gris muy claro sobre blanco: «¿No es el lugar? Cámbialo abajo»" },
      { id: "zona-direccion", etiqueta: "Dirección detectada: Parque Centenario, entrada de Av. Díaz Vélez, con enlace «Cambiar»" },
      { id: "zona-alcance", etiqueta: "Texto: «Tu alerta llega a 2 km a la redonda»" },
      { id: "zona-planes", problema: "peso-invertido", etiqueta: "Botón grande verde, el más visible de la pantalla: «Ver planes de difusión»" },
      { id: "zona-seguir", problema: "peso-invertido", etiqueta: "Enlace de texto chico, sin forma de botón: «Continuar»" },
    ],
    problemas: [
      {
        id: "contraste",
        titulo: "La instrucción del mapa casi no se lee",
        que: "«¿No es el lugar? Cámbialo abajo» está en gris muy claro (#AAB4C0) sobre blanco: mide 2,1:1.",
        donde: "Alerta de mascota perdida - Zona, texto debajo del mapa.",
        criterio: "El texto necesita un contraste de 4,5:1 como mínimo (WCAG 2.2, criterio 1.4.3).",
        porque: "La usuaria está en la calle, con sol en la pantalla. Si no lee la instrucción, deja el lugar que salió solo y la alerta se publica con una zona equivocada.",
        severidad: "media",
        pregunta: "¿Por qué la instrucción del mapa es un problema?",
        opciones: [
          { t: "El gris de la letra queda por debajo del contraste mínimo de lectura", ok: true },
          { t: "El tamaño de la letra queda por debajo del mínimo que pide la norma", nota: "La norma de accesibilidad no fija un tamaño mínimo de letra. Lo que sí fija, y aquí falla, es el contraste." },
          { t: "El alto del texto queda por debajo del área mínima para tocar", nota: "El área mínima vale para los controles, y esto es un texto. Lo que falla es el contraste." },
          { t: "El lugar del texto queda fuera del orden en que se lee la pantalla", nota: "Va justo después del mapa que explica. Lo que falla es el contraste." },
        ],
      },
      {
        id: "peso-invertido",
        titulo: "Lo que la usuaria necesita pesa menos que lo que Patitas quiere vender",
        que: "El botón grande dice «Ver planes de difusión». Para seguir con la alerta hay que encontrar el enlace chico «Continuar».",
        donde: "Alerta de mascota perdida - Zona, los dos controles de abajo.",
        criterio: "La acción principal de la tarea lleva el mayor peso visual (jerarquía visual).",
        porque: "La usuaria toca el botón grande creyendo que avanza y llega a una pantalla de precios. Varias personas entienden que publicar la alerta se paga, y abandonan.",
        severidad: "media",
        pregunta: "¿Por qué los dos controles de abajo son un problema?",
        opciones: [
          { t: "Seguir con la alerta pesa menos a la vista que ver los planes", ok: true },
          { t: "Seguir con la alerta queda más lejos del pulgar que ver los planes", nota: "Los dos están abajo, a mano. El problema es cuál pesa más a la vista." },
          { t: "Seguir con la alerta y ver los planes quedan pegados y se tocan por error", nota: "Cada uno tiene su propia área para tocar, de 44 px de alto. El problema es cuál pesa más a la vista." },
          { t: "Seguir con la alerta y ver los planes dicen lo mismo con otras palabras", nota: "Dicen cosas distintas: uno publica la alerta y el otro vende. El problema es cuál pesa más." },
        ],
      },
    ],
  },
  {
    id: "revisar",
    acto: "ver",
    nombre: "Alerta de mascota perdida - Revisar",
    contexto: "Último paso antes de publicar.",
    consigna: "¿Algo la frena?",
    ayuda: "Toca hasta 3 fallas.",
    regiones: [
      { id: "rev-barra", etiqueta: "Barra superior: flecha para volver y título «Alerta de mascota perdida»" },
      { id: "rev-pasos", etiqueta: "Indicador: paso 3 de 3, Revisar" },
      { id: "rev-mascota", etiqueta: "Resumen de Luna con su foto: gata gris, 3 años, vista hoy a las 18:40, y enlace «Cambiar foto»" },
      { id: "rev-zona", etiqueta: "Zona: Parque Centenario, 2 km a la redonda, y enlace «Cambiar zona»" },
      { id: "rev-contacto", etiqueta: "Contacto: 600 000 000, solo lo ve quien toque «Vi a esta mascota», y enlace «Cambiar contacto»" },
      { id: "rev-costo", etiqueta: "Texto: «Publicar la alerta no tiene costo»" },
      { id: "rev-boton", etiqueta: "Botón verde activo: «Publicar alerta»" },
    ],
    problemas: [],
    limpia: {
      titulo: "Esta pantalla está bien",
      texto: "Muestra todo lo que se va a publicar, deja cambiar cada dato y dice cuánto cuesta. Un hallazgo sin evidencia no entra en el informe: saber cuándo no hay nada también es parte del oficio.",
    },
  },
  {
    id: "ia",
    acto: "ia",
    nombre: "Alerta de Luna - Posible coincidencia",
    contexto: "Dos horas después, Patitas le avisa esto.",
    consigna: "¿Qué la puede llevar a un error?",
    ayuda: "Toca hasta 3 fallas.",
    regiones: [
      { id: "ia-barra", etiqueta: "Barra superior: flecha para volver y título «Alerta de Luna»" },
      { id: "ia-titular", problema: "certeza", etiqueta: "Titular grande: «¡Encontramos a Luna!»" },
      { id: "ia-porcentaje", problema: "certeza", etiqueta: "Etiqueta debajo del titular: «Coincidencia: 62 %», comparado con IA" },
      { id: "ia-foto", etiqueta: "Foto de una gata gris. Pie: foto de Marcos R., hace 20 minutos, a 1,4 km" },
      { id: "ia-cerrar", problema: "cierre", etiqueta: "Botón grande verde, el más visible: «Cerrar mi alerta»" },
      { id: "ia-enlaces", problema: "cierre", etiqueta: "Dos enlaces de texto chicos: «Ver la foto en grande» y «Escribirle a Marcos»" },
    ],
    problemas: [
      {
        id: "certeza",
        titulo: "La IA afirma lo que solo supone",
        que: "El titular dice «¡Encontramos a Luna!» y, debajo, la coincidencia es del 62 %.",
        donde: "Alerta de Luna - Posible coincidencia, titular y etiqueta de coincidencia.",
        criterio: "Lo que la interfaz promete coincide con lo que la IA puede asegurar: una suposición se presenta como suposición.",
        porque: "La usuaria lee que apareció su gata. Si es otra, deja de buscar durante las horas que más cuentan.",
        severidad: "alta",
        pregunta: "Mira el titular y la etiqueta que tiene debajo. ¿Cuál es el problema?",
        opciones: [
          { t: "El titular da por seguro lo que la etiqueta marca como una estimación", ok: true },
          { t: "El titular y la etiqueta muestran dos porcentajes que no coinciden", nota: "Hay un solo porcentaje, en la etiqueta. El riesgo está en lo que afirma el titular." },
          { t: "El titular y la etiqueta ocultan que la comparación la hizo una IA", nota: "La etiqueta lo dice: «Comparado con IA». El riesgo está en lo que afirma el titular." },
          { t: "El titular y la etiqueta no dicen a qué distancia apareció la gata", nota: "La distancia está al pie de la foto. El riesgo es que el titular asegura algo que la IA solo estima." },
        ],
      },
      {
        id: "cierre",
        titulo: "Si la IA se equivoca, lo más fácil es quedarse sin alerta",
        que: "El botón principal es «Cerrar mi alerta». Ver la foto en grande y escribirle a quien la subió son enlaces chicos.",
        donde: "Alerta de Luna - Posible coincidencia, botón y enlaces de abajo.",
        criterio: "Ante un posible error de la IA, comprobar va antes y pesa más que la acción que cuesta deshacer.",
        porque: "Un toque cierra la alerta y la búsqueda se detiene, apoyada en una coincidencia del 62 %.",
        severidad: "alta",
        pregunta: "¿Por qué el botón «Cerrar mi alerta» es un problema?",
        opciones: [
          { t: "Cerrar la alerta es lo más visible, y comprobar queda en letra chica", ok: true },
          { t: "Cerrar la alerta tapa la flecha, y la pantalla no deja volver atrás", nota: "La flecha para volver está arriba, a la vista. El riesgo es cuál es la acción principal." },
          { t: "Cerrar la alerta queda pegado a los enlaces, y se toca por error", nota: "Hay espacio entre el botón y los enlaces. El riesgo es que cerrar sea la acción principal." },
          { t: "Cerrar la alerta usa otro verde, y no parece un botón principal", nota: "Es el mismo verde de toda la app, y por eso mismo invita a tocarlo antes de comprobar." },
        ],
      },
    ],
  },
];

export const ORDENAR = {
  consigna: "¿Qué se arregla primero?",
  ayuda: "Arrastra para ordenar.",
  // El recorrido se dibuja como un embudo (Anita, 19/11/2026): la caída se ve antes de leerla.
  embudo: {
    titulo: "De 100 personas que empiezan la alerta:",
    pasos: [{ n: 100, t: "Empiezan" }, { n: 38, t: "Pasan Foto" }, { n: 24, t: "Pasan Zona" }, { n: 20, t: "Publican" }],
  },
  items: [
    { id: "A", t: "La foto no sube y nadie dice por qué", d: "Le pasa a 6 de cada 10 personas" },
    { id: "B", t: "El botón grande lleva a los planes de pago", d: "Lo ven las 38 personas que llegan a Zona" },
    { id: "C", t: "Borrar una alerta cerrada no pide confirmación", d: "La abren 3 de cada 100 personas" },
    { id: "D", t: "Un título dice «Publicacion», sin tilde", d: "Lo ven quienes publican" },
  ],
  // Orden inicial que se muestra (ni correcto ni invertido).
  inicial: ["C", "D", "B", "A"],
  // Se puntúan 3 comprobaciones; C y D pueden ir en cualquier orden entre sí.
  comprobaciones: [
    { id: "a-primero", t: "La foto va primero", porque: "Impide publicar en el paso donde se van 62 de cada 100 personas." },
    { id: "b-antes-c", t: "Los planes de pago van antes que borrar alertas cerradas", porque: "Lo ven las 38 personas que llegan a Zona, y ahí se van 14. Borrar sin confirmar parece grave, y pasa en alertas ya cerradas que abren 3 de cada 100 personas." },
    { id: "d-despues", t: "La tilde va después de la foto y de los planes", porque: "Se arregla en un minuto, pero no cambia cuántas personas publican. Va después de lo que les impide publicar." },
  ],
};

// Tres opciones por pregunta (Anita, 19/11/2026): que descubra el dolor sin que cueste leerla.
// Las tres tienen la misma forma y un largo parecido.
export const DECIR = [
  {
    id: "abrir",
    // Para entonces nadie recuerda quién es Sofía ni qué hay que hacer (prueba de Seba, 19/11/2026): se dice acá.
    contexto: "Ahora le cuentas lo que encontraste a Sofía, la líder de producto. Tiene dos minutos.",
    consigna: "¿Con qué frase abres tu resumen?",
    opciones: [
      { t: "62 de cada 100 personas se van en el primer paso: la foto no sube y nadie dice por qué.", ok: true },
      { t: "80 de cada 100 personas no publican la alerta: el recorrido tiene demasiados pasos.", nota: "Sofía ya sabe que 80 no publican. Y los números dicen otra cosa: 62 se van en el primer paso, y el recorrido tiene tres." },
      { t: "6 problemas en las 4 pantallas de la alerta: 4 de severidad alta y 2 de severidad media.", nota: "Cuenta el trabajo hecho. Quien decide necesita primero qué pasa y cuánto le cuesta." },
    ],
    porque: "Abre con el número que le importa a quien decide, dónde pasa y por qué. Lo demás es respaldo.",
  },
  {
    id: "recomendar",
    contexto: "",
    consigna: "¿Qué le recomiendas para la foto?",
    opciones: [
      { t: "Aceptar las fotos del celular y, si una falla, decir por qué. El éxito se mide con cuántas personas pasan del primer paso.", ok: true },
      { t: "Mostrar el aviso de error más grande y en el centro. El éxito se mide con cuántas personas tocan «Reintentar».", nota: "Hace más visible un aviso que sigue sin explicar nada, y la foto sigue sin subir." },
      { t: "Rediseñar el paso de la foto con mi propuesta en Figma. El éxito se mide probándola con cinco personas.", nota: "Sofía te pidió mirar la alerta, no rediseñarla. La recomendación da la dirección y deja el diseño al equipo, que conoce sus límites." },
    ],
    porque: "Da una dirección concreta, deja el diseño al equipo y dice cómo se sabrá si funcionó.",
  },
];

// Preguntas personales (pedido de Anita): rompen el ritmo, se responden con sí o no y no cambian el puntaje.
// En pantalla va solo la pregunta. Se guardan para saber quién juega.
export const PERFIL = [
  { id: "audito", pregunta: "¿Alguna vez hiciste una auditoría formal de un producto digital?" },
  { id: "explicar", pregunta: "¿Te pasó saber que algo estaba mal en un diseño y no poder explicar por qué?" },
  { id: "ia", pregunta: "¿Te pidieron alguna vez corregir algo hecho con IA?" },
  { id: "trabaja", pregunta: "¿Hoy trabajas en UX/UI?" },
];

// Precios que el juego muestra. AL CAMBIAR UN PRECIO EN SKOOL, ACTUALIZAR AQUÍ (y nada más: sale de este lugar).
// Premium pasa a 45 el 2/1/2027. El VIP pasa a 648 desde la venta 11.
export const PRECIOS = { premiumMes: 39, vipAnio: 468, vipDespues: 648, actualizado: "2026-11-18" };

// Máximos por acto (ver puntaje.js).
export const MAXIMOS = { ver: 5, nombrar: 4, ordenar: 3, ia: 4, decir: 2 };
export const MARCAS_MAX = 3;

export const ACTOS = [
  { id: "ver", nombre: "Ver", mide: "Pasos 1 y 2", ic: "mira" },
  { id: "nombrar", nombre: "Nombrar", mide: "Pasos 1 y 2", ic: "etiqueta" },
  { id: "ordenar", nombre: "Priorizar", mide: "Pasos 3 y 4", ic: "lista" },
  { id: "ia", nombre: "Revisar la IA", mide: "Paso 5", ic: "chispa" },
  { id: "decir", nombre: "Defender", mide: "Paso 6", ic: "voz" },
];

export const NIVELES = [
  { id: "ves", nombre: "Ves", corto: "Notas que algo falla", ic: "mira" },
  { id: "nombras", nombre: "Nombras", corto: "Sabes decir por qué", ic: "etiqueta" },
  { id: "ordenas", nombre: "Priorizas", corto: "Sabes qué va primero", ic: "lista" },
  { id: "defiendes", nombre: "Defiendes", corto: "Lo presentas a quien decide", ic: "voz" },
];
// El destino del camino: lo que vende el camino de auditor.
export const DESTINO = { nombre: "Cobras", corto: "Por evaluar productos", ic: "meta" };

// Lo que trae el desglose que se envía por correo (se nombra antes de pedir el correo).
// Al jugar no se muestra qué estaba bien: eso es lo que llega.
// La plantilla es el incentivo (Anita, 19/11/2026): algo para usar ya y una muestra de lo que hay dentro del camino.
// Su enlace va en config.js (plantillaUrl). Sin enlace, el sitio publicado no la promete.
export const DESGLOSE = {
  // El título dice el número (Alex y la revisión de conversión, 19/11/2026). Sin «se te escaparon»: no se lee igual en todos los países (Anita).
  titulo: (faltan) => faltan === 0 ? "Encontraste los 6. Te enviamos si acertaste el porqué y el orden."
    : faltan === 1 ? "Te faltó 1. Te enviamos cuál era y por qué."
    : `Te faltaron ${faltan}. Te enviamos cuáles eran y por qué.`,
  trae: ["Las respuestas correctas, una por una", "Tus 5 habilidades, medidas"],
  plantilla: "Y una plantilla de Notion para medir la severidad en tu próxima auditoría",
  plantillaTitulo: "Tu plantilla para tu próxima auditoría",
  plantillaBoton: "Abrir la plantilla",
};

// La invitación a la comunidad (resultado): un puente con lo que le pasó a la persona y lo que recibe.
// El puente dice en qué paso se trabaja su salto. No dice «empiezas ahí»: el camino empieza igual para todas las personas.
export const PUENTE = {
  ver: "Aprender a ver los problemas es el Paso 1 del camino de auditor.",
  nombrar: "Ponerle nombre a lo que ves se trabaja en los Pasos 1 y 2 del camino de auditor.",
  ordenar: "Priorizar por lo que le cuesta al negocio se trabaja en los Pasos 3 y 4 del camino de auditor.",
  ia: "Revisar lo que hace una IA es el Paso 5 del camino de auditor.",
  decir: "Defenderlo ante quien decide es el Paso 6 del camino de auditor.",
  // La certificación no entra en Premium: se dice ahí mismo, para que nadie entre a 39 esperando la revisión (Alex, 19/11/2026).
  certificar: "Certificarlo es el Paso 7 del camino de auditor: una auditoría real, revisada por Anita Sevilla Ull. Va con el plan VIP.",
};
// Primero lo que la persona ya probó (las prácticas). El tercero usa las palabras del About de Skool.
export const OFERTA = [
  "Prácticas sobre pantallas como las de este juego",
  "7 pasos, de ver un problema a presentarlo a quien decide",
  "Tu propia auditoría, lista para mostrar",
];

// Titular del resultado según el nivel y la primera compuerta que no se pasó ("salto").
export const TITULARES = {
  "ves/ver": "En este caso viste una parte. Tu salto profesional está en verlo completo.",
  "ves/nombrar": "Ves lo que falla. Tu salto profesional está en ponerle nombre.",
  "nombras/ordenar": "Lo ves y lo nombras. Tu salto profesional está en priorizarlo.",
  "ordenas/decir": "Lo ves, lo nombras y lo priorizas. Tu salto profesional está en defenderlo.",
  "ordenas/ia": "Lo ves, lo nombras y lo priorizas. Tu salto profesional está en revisar lo que hace la IA.",
  "defiendes/certificar": "Lo ves, lo nombras, lo priorizas y lo defiendes. Tu salto profesional está en certificarlo.",
};

// Si no encontró ninguno, «viste una parte» sería falso.
export const TITULAR_CERO = "En este caso no encontraste los problemas. Tu salto profesional está en aprender a verlos.";
// Quien marca de más ve un número alto: el titular dice también lo que marcó sin que fuera una falla.
export const MARCAS_DE_MAS = 3;
export const TITULAR_DE_MAS = (hallados, falsas) => `Encontraste ${hallados} y también marcaste ${falsas} cosas que funcionaban. Tu salto profesional está en distinguir qué es una falla.`;

// Ruta por el camino: cada bloque dice lo que la persona puede hacer al terminarlo.
// "alto" = ya lo hace en este caso. Las filas "alto" seguidas se juntan en una sola.
export const RUTA = [
  {
    pasos: "Pasos 1 y 2", desde: 1, hasta: 2, mide: ["ver", "nombrar"],
    alto: "Ya ves los problemas y les pones su criterio.",
    medio: "Le pones el criterio justo a cada problema.",
    bajo: "Aprendes a ver los problemas y a ponerles nombre.",
  },
  {
    pasos: "Pasos 3 y 4", desde: 3, hasta: 4, mide: ["ordenar"],
    alto: "Ya priorizas por lo que le cuesta al negocio.",
    medio: "Sustentas con números qué va antes.",
    bajo: "Priorizas por lo que le cuesta al negocio.",
  },
  {
    pasos: "Paso 5", desde: 5, hasta: 5, mide: ["ia"],
    alto: "Ya ves dónde falla lo que hace una IA.",
    medio: "Revisas lo que hace una IA sin dejar pasar riesgos.",
    bajo: "Dices dónde va a fallar lo que hace una IA.",
  },
  {
    pasos: "Paso 6", desde: 6, hasta: 6, mide: ["decir"],
    alto: "Ya hablas como necesita quien decide.",
    medio: "Tu resumen llega a quien decide.",
    bajo: "Entregas un informe que se entiende en dos minutos.",
  },
  {
    pasos: "Paso 7", desde: 7, hasta: 7, mide: [],
    fijo: "Una auditoría real, revisada por Anita Sevilla Ull.",
  },
];
export const RUTA_JUNTA = "Lo lograste en este caso corto.";
export const ETIQUETAS_BANDA = { alto: "Ya lo haces", medio: "Para afinar", bajo: "Para aprender" };

export const AVISO_ORIENTACION =
  "Es una orientación hecha con un solo caso. Sirve para saber por dónde empezar.";
