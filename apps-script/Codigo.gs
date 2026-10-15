/**
 * Guarda quais presentes já foram escolhidos na lista do chá de casa nova.
 * Fica ligado a uma planilha do Google: cada escolha vira uma linha (id e horário).
 *
 * Para fazer um item voltar a ficar disponível, apague a linha dele na aba "escolhas".
 */

var ABA = 'escolhas';

function doGet(e) {
  var p = (e && e.parameter) || {};
  var aba = abaEscolhas_();
  if (p.action === 'claim') {
    return json_(escolher_(aba, String(p.id || '')));
  }
  return json_({ taken: escolhidos_(aba) });
}

function abaEscolhas_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(['id', 'escolhido_em']);
  }
  return aba;
}

function escolhidos_(aba) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return [];
  return aba.getRange(2, 1, ultima - 1, 1).getValues()
    .map(function (linha) { return String(linha[0]); })
    .filter(function (id) { return id; });
}

// Só a primeira pessoa consegue: o bloqueio impede duas escolhas ao mesmo tempo.
function escolher_(aba, id) {
  if (!/^[a-z0-9-]{1,80}$/.test(id)) return { ok: false, taken: escolhidos_(aba) };
  var trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    var lista = escolhidos_(aba);
    if (lista.indexOf(id) >= 0) return { ok: false, taken: lista };
    aba.appendRow([id, new Date()]);
    lista.push(id);
    return { ok: true, taken: lista };
  } finally {
    trava.releaseLock();
  }
}

function json_(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
