// Mirada de auditor · configuración del sitio.
// Conectado el 19/11/2026 al proyecto de Supabase «test-vocacional» (el mismo del test vocacional y del sitio).
// En local (localhost) no se mide ni se envía ningún correo: lo corta datos.js.
// La clave es la pública (anon): solo permite insertar en las tablas de medición.
export const CONFIG = {
  supabaseUrl: "https://ypmowaaxoyuknlmwmyth.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbW93YWF4b3l1a25sbXdteXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNzk1ODEsImV4cCI6MjA5MjY1NTU4MX0.r9c_VB5H-kUmICseEc5La-VZ2_jKlAdAuDlWIIVVh1w",
  // Función de Supabase que guarda el correo y envía el desglose con Resend (supabase/functions/auditor-desglose).
  desgloseUrl: "https://ypmowaaxoyuknlmwmyth.supabase.co/functions/v1/auditor-desglose",
  // Plantilla de Notion que se regala con el desglose. Vacío: el sitio publicado no la promete ni la muestra.
  plantillaUrl: "https://elegant-unicorn-d6c.notion.site/41dfe4da3fb981aa98ffe180364579ef",
  kit: "https://app.kit.com/forms/9994514/subscriptions",
  kitOrigen: "mirada-de-auditor",
  skool: "https://www.skool.com/comunidaduxui/about",
  paso0: "https://www.skool.com/comunidaduxui/classroom/e632fb03",
  legales: "https://legales.comunidaduxui.com/",
};
