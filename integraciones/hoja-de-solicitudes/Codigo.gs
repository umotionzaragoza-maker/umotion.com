/**
 * Hoja de solicitudes de la web · Google Apps Script (se pega en Extensiones → Apps Script de la hoja).
 *
 * Qué hace:
 *  - Recibe cada solicitud de diagnóstico y cada mensaje de contacto de la web (doPost) y los anota en
 *    «Solicitudes» y «Mensajes».
 *  - Avisa por correo desde la propia cuenta de Gmail del negocio.
 *  - «Solicitudes» funciona como un pequeño CRM: cada solicitud tiene un estado (Nueva → Contactado →
 *    Diagnóstico agendado → Diagnóstico hecho → Propuesta enviada → Cliente / Descartada) y una fecha de seguimiento.
 *  - «Resumen»: solicitudes de 7 y 30 días, por tipo de negocio, tareas más pedidas, embudo y pendientes.
 *  - Menú «Web»: preparar hojas, ver la clave secreta para Vercel y enviar un correo de prueba.
 *
 * Instrucciones paso a paso: LEEME.md (junto a este archivo) y docs/PUBLICAR.md del proyecto.
 */

var NEGOCIO = 'Umotion';

var HOJA = { solicitudes: 'Solicitudes', mensajes: 'Mensajes', resumen: 'Resumen' };

var CABECERAS = {
  Solicitudes: ['Fecha', 'Nº solicitud', 'Nombre', 'Negocio', 'Tipo de negocio', 'Tareas', 'Detalle', 'Dónde', 'Cuándo', 'Teléfono', 'Estado', 'Próximo paso', 'Notas'],
  Mensajes: ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Motivo', 'Mensaje', 'Atendido'],
};

// Columnas de «Solicitudes» (1 = A).
var S = { fecha: 1, numero: 2, nombre: 3, negocio: 4, sector: 5, tareas: 6, detalle: 7, modalidad: 8, franja: 9, telefono: 10, estado: 11, proximo: 12, notas: 13 };

var ESTADOS = ['Nueva', 'Contactado', 'Diagnóstico agendado', 'Diagnóstico hecho', 'Propuesta enviada', 'Cliente', 'Descartada'];

// ───────────────────────────── menú

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Web')
    .addItem('1. Preparar las hojas', 'prepararHojas')
    .addItem('Ver la clave secreta (para Vercel)', 'verSecreto')
    .addItem('Enviar un correo de prueba', 'correoDePrueba')
    .addToUi();
}

function libro_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function props_() {
  return PropertiesService.getScriptProperties();
}

function hoja_(nombre) {
  var h = libro_().getSheetByName(nombre);
  if (!h) throw new Error('Falta la hoja «' + nombre + '». Usa Web → Preparar las hojas.');
  return h;
}

// ───────────────────────────── preparación

function prepararHojas() {
  var libro = libro_();
  Object.keys(CABECERAS).forEach(function (nombre) {
    var h = libro.getSheetByName(nombre) || libro.insertSheet(nombre);
    var cab = CABECERAS[nombre];
    h.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#080a14').setFontColor('#eef1f7');
    h.setFrozenRows(1);
  });

  var sol = hoja_(HOJA.solicitudes);
  sol.getRange('A2:A').setNumberFormat('dd/MM/yyyy HH:mm');
  sol.getRange('L2:L').setNumberFormat('dd/MM/yyyy');
  sol.getRange('K2:K').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).build());
  sol.setColumnWidth(S.tareas, 280);
  sol.setColumnWidth(S.detalle, 360);
  sol.setColumnWidth(S.notas, 280);

  hoja_(HOJA.mensajes).getRange('A2:A').setNumberFormat('dd/MM/yyyy HH:mm');
  hoja_(HOJA.mensajes).setColumnWidth(6, 420);

  // Colores que se leen de un vistazo: nuevas en azul claro, clientes en verde, descartadas en gris.
  sol.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Nueva').setBackground('#d6f3ff').setRanges([sol.getRange('K2:K')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Cliente').setBackground('#cdeedd').setRanges([sol.getRange('K2:K')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Descartada').setFontColor('#9a9a9a').setRanges([sol.getRange('K2:K')]).build(),
  ]);

  prepararResumen_();
  if (!props_().getProperty('SECRETO')) props_().setProperty('SECRETO', Utilities.getUuid().replace(/-/g, ''));
  SpreadsheetApp.getUi().alert('Hojas preparadas. Siguiente paso: publicar el script como aplicación web (ver LEEME.md).');
}

function prepararResumen_() {
  var libro = libro_();
  var r = libro.getSheetByName(HOJA.resumen) || libro.insertSheet(HOJA.resumen, 0);
  r.clear();
  var cifras = [
    ['Resumen', ''],
    ['Solicitudes registradas', '=COUNTA(Solicitudes!B2:B)'],
    ['Solicitudes últimos 7 días', '=COUNTIFS(Solicitudes!A2:A,">="&(TODAY()-7))'],
    ['Solicitudes últimos 30 días', '=COUNTIFS(Solicitudes!A2:A,">="&(TODAY()-30))'],
    ['Nuevas sin contactar', '=COUNTIF(Solicitudes!K2:K,"Nueva")'],
    ['Diagnósticos agendados', '=COUNTIF(Solicitudes!K2:K,"Diagnóstico agendado")'],
    ['Propuestas enviadas', '=COUNTIF(Solicitudes!K2:K,"Propuesta enviada")'],
    ['Clientes', '=COUNTIF(Solicitudes!K2:K,"Cliente")'],
    ['Seguimientos vencidos', '=COUNTIFS(Solicitudes!L2:L,"<"&TODAY(),Solicitudes!K2:K,"<>Cliente",Solicitudes!K2:K,"<>Descartada")'],
    ['Mensajes sin atender', '=COUNTIFS(Mensajes!B2:B,"<>",Mensajes!G2:G,"")'],
  ];
  r.getRange(1, 1, cifras.length, 1).setValues(cifras.map(function (f) { return [f[0]]; }));
  r.getRange(2, 2, cifras.length - 1, 1).setFormulas(cifras.slice(1).map(function (f) { return [f[1]]; }));
  r.getRange('A1').setFontSize(16).setFontWeight('bold');

  r.getRange('D1').setValue('Por tipo de negocio (30 días)').setFontWeight('bold');
  r.getRange('D2').setFormula(
    '=IFERROR(QUERY(FILTER(Solicitudes!E2:E,Solicitudes!A2:A>=TODAY()-30),' +
      '"select Col1, count(Col1) group by Col1 order by count(Col1) desc label Col1 \'Tipo\', count(Col1) \'Solicitudes\'",0),"Aún no hay solicitudes")'
  );
  r.getRange('H1').setValue('Seguimientos pendientes').setFontWeight('bold');
  r.getRange('H2').setFormula(
    '=IFERROR(SORT(FILTER({Solicitudes!L2:L,Solicitudes!C2:C,Solicitudes!D2:D,Solicitudes!K2:K},Solicitudes!L2:L<>"",Solicitudes!K2:K<>"Cliente",Solicitudes!K2:K<>"Descartada"),1,TRUE),"Nada pendiente")'
  );
  r.setColumnWidth(1, 240);
  r.setColumnWidth(4, 220);
}

function verSecreto() {
  var s = props_().getProperty('SECRETO');
  if (!s) return SpreadsheetApp.getUi().alert('Primero usa Web → Preparar las hojas.');
  SpreadsheetApp.getUi().alert('Clave secreta para Vercel (variable HOJA_WEBHOOK_SECRETO):\n\n' + s + '\n\nNo la compartas con nadie más.');
}

// ───────────────────────────── entrada desde la web

function doGet() {
  return ContentService.createTextOutput('Hoja de solicitudes de ' + NEGOCIO + ': conectada.');
}

function doPost(e) {
  var cuerpo;
  try {
    cuerpo = JSON.parse(e.postData.contents);
  } catch (err) {
    return respuesta_({ ok: false, error: 'formato' });
  }
  var secreto = props_().getProperty('SECRETO');
  if (!secreto || !cuerpo || cuerpo.secreto !== secreto) return respuesta_({ ok: false, error: 'secreto' });

  var aviso = null;
  var cerrojo = LockService.getScriptLock();
  cerrojo.waitLock(20000);
  try {
    if (cuerpo.tipo === 'diagnostico') aviso = registrarSolicitud_(cuerpo.datos);
    else if (cuerpo.tipo === 'contacto') aviso = registrarMensaje_(cuerpo.datos);
    else return respuesta_({ ok: false, error: 'tipo' });
  } finally {
    cerrojo.releaseLock();
  }
  if (aviso) avisar_(aviso);
  return respuesta_({ ok: true });
}

function registrarSolicitud_(d) {
  var sol = hoja_(HOJA.solicitudes);
  var numero = String(d.numero || '');
  if (!/^D-\d{6}-[2-9A-HJ-NP-Z]{4}$/.test(numero)) throw new Error('Número de solicitud no válido');

  // Si la web reintenta la misma solicitud, no se duplica.
  var ul = sol.getLastRow();
  if (ul > 1) {
    var ya = sol.getRange(2, S.numero, ul - 1, 1).getValues().some(function (f) { return f[0] === numero; });
    if (ya) return null;
  }

  sol.appendRow([
    new Date(), numero, seguro_(d.nombre), seguro_(d.negocio), seguro_(d.sector), seguro_(d.tareas), seguro_(d.detalle),
    seguro_(d.modalidad), seguro_(d.franja), seguro_(d.telefono), 'Nueva', '', '',
  ]);

  var fila = function (etiqueta, valor) {
    return valor ? '<tr><td style="padding:4px 16px 4px 0;color:#535d78">' + etiqueta + '</td><td style="padding:4px 0">' + esc_(valor) + '</td></tr>' : '';
  };
  return {
    asunto: 'Nuevo diagnóstico ' + numero + ' · ' + d.nombre + (d.negocio ? ' · ' + d.negocio : ''),
    html:
      '<h2 style="margin:0 0 8px">Nueva solicitud de diagnóstico</h2>' +
      '<p><strong>' + esc_(numero) + '</strong></p>' +
      '<table style="border-collapse:collapse">' +
      fila('Nombre', d.nombre) + fila('Negocio', d.negocio) + fila('Tipo', d.sector) + fila('Le quita tiempo', d.tareas) +
      fila('Detalle', d.detalle) + fila('Dónde', d.modalidad) + fila('Cuándo', d.franja) + fila('Teléfono', d.telefono) +
      '</table>' +
      '<p>La persona lo está enviando también por WhatsApp con este mismo número. Respóndele allí para quedar y cambia su estado en la hoja:<br>' +
      '<a href="' + libro_().getUrl() + '">Abrir la hoja de solicitudes</a></p>',
  };
}

function registrarMensaje_(d) {
  hoja_(HOJA.mensajes).appendRow([new Date(), seguro_(d.nombre), seguro_(d.email), seguro_(d.telefono), seguro_(d.motivo), seguro_(d.mensaje), '']);
  return {
    asunto: 'Web · ' + d.motivo + ' · ' + d.nombre,
    responderA: d.email || '',
    html:
      '<h2 style="margin:0 0 8px">Nuevo mensaje desde la web</h2>' +
      '<p><strong>Motivo:</strong> ' + esc_(d.motivo) + '</p>' +
      '<p><strong>Nombre:</strong> ' + esc_(d.nombre) + '</p>' +
      '<p><strong>Email:</strong> ' + esc_(d.email || '—') + '</p>' +
      '<p><strong>Teléfono:</strong> ' + esc_(d.telefono || '—') + '</p>' +
      '<p><strong>Mensaje:</strong><br>' + esc_(d.mensaje).replace(/\n/g, '<br>') + '</p>',
  };
}

function avisar_(a) {
  var para = props_().getProperty('CORREO_AVISOS') || Session.getEffectiveUser().getEmail();
  var opciones = { to: para, subject: String(a.asunto).slice(0, 180), htmlBody: a.html, name: 'Web de ' + NEGOCIO };
  if (a.responderA) opciones.replyTo = a.responderA;
  MailApp.sendEmail(opciones);
}

function correoDePrueba() {
  avisar_({ asunto: 'Prueba de avisos de la web', html: '<p>Si lees esto, los avisos de solicitudes y mensajes llegan bien.</p>' });
  SpreadsheetApp.getUi().alert('Correo de prueba enviado. Mira la bandeja de entrada (y la de spam la primera vez).');
}

// ───────────────────────────── utilidades

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Un texto que empieza por = + - @ se convertiría en fórmula: se guarda como texto. */
function seguro_(v) {
  if (v === null || v === undefined) return '';
  var s = String(v).slice(0, 2000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function esc_(v) {
  return String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
