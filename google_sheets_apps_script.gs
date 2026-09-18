/**
 * RARITY AGENCY - GOOGLE APPS SCRIPT
 * Sincronização Inteligente com Sobrescrita por E-mail ou Telefone (Sem Duplicar Linhas)
 *
 * REGRAS:
 * 1. Identifica se o lead já existe na planilha por E-MAIL ou por TELEFONE.
 * 2. Se JÁ EXISTIR: Sobrescreve e atualiza os dados na mesma linha (não gera nova linha).
 * 3. Se NÃO EXISTIR: Insere uma nova linha.
 * 4. Ao enviar o diagnóstico: grava os dados e define "Scheduled on Cal.com?" como "No" (ou mantém "Yes" se já tiver agendado).
 * 5. Ao confirmar no Cal.com: atualiza "Scheduled on Cal.com?" para "Yes" e atualiza Nome, E-mail e Telefone com os dados verídicos do Cal.com.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Evita concorrência e condições de corrida entre requisições simultâneas
    lock.waitLock(10000);

    var contents = e.postData ? e.postData.contents : null;
    if (!contents) {
      return responseJson({ status: "error", message: "No data payload received" });
    }

    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getActiveSheet();

    // Mapeamento dinâmico dos cabeçalhos da planilha (Row 1)
    var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 16)).getValues()[0];
    var colMap = getColumnMapping(headers);

    // Normalização dos dados recebidos para busca
    var incomingEmail = (data.email || "").toString().trim().toLowerCase();
    var incomingPhoneDigits = (data.phone || "").toString().replace(/[^0-9]/g, "");
    var isBookingConfirmed = (data.scheduledOnCal === "Yes" || data.action === "update_booking_status");

    var lastRow = sheet.getLastRow();
    var matchedRowIndex = -1;

    // ----------------------------------------------------
    // BUSCA POR E-MAIL OU TELEFONE IGUAL (DE BAIXO PARA CIMA)
    // ----------------------------------------------------
    if (lastRow > 1) {
      var emailValues = sheet.getRange(2, colMap.email, lastRow - 1, 1).getValues();
      var phoneValues = sheet.getRange(2, colMap.phone, lastRow - 1, 1).getValues();

      for (var i = emailValues.length - 1; i >= 0; i--) {
        var rowEmail = (emailValues[i][0] || "").toString().trim().toLowerCase();
        var rowPhoneDigits = (phoneValues[i][0] || "").toString().replace(/[^0-9]/g, "");

        // 1. Identificação por E-MAIL igual
        if (incomingEmail && rowEmail && rowEmail === incomingEmail) {
          matchedRowIndex = i + 2; // +2 porque a leitura começou na linha 2
          break;
        }

        // 2. Identificação por TELEFONE igual (mínimo de 8 dígitos para precisão)
        if (incomingPhoneDigits && incomingPhoneDigits.length >= 8 && rowPhoneDigits && rowPhoneDigits.length >= 8) {
          if (rowPhoneDigits.indexOf(incomingPhoneDigits) !== -1 || incomingPhoneDigits.indexOf(rowPhoneDigits) !== -1) {
            matchedRowIndex = i + 2;
            break;
          }
        }
      }
    }

    var now = new Date();
    var defaultTimestamp = Utilities.formatDate(now, "America/New_York", "MMM dd, yyyy, h:mm a");
    var formattedPhone = data.phone ? (data.phone.toString().startsWith("+") ? "'" + data.phone : data.phone) : "";

    // ----------------------------------------------------
    // CASO 1: LEAD ENCONTRADO -> SOBRESCREVE OS DADOS NA MESMA LINHA
    // ----------------------------------------------------
    if (matchedRowIndex > 1) {
      // Atualiza Timestamp
      sheet.getRange(matchedRowIndex, colMap.timestamp).setValue(data.timestamp || defaultTimestamp);

      // Sobrescreve Nome se enviado
      if (data.fullName || data.name) {
        sheet.getRange(matchedRowIndex, colMap.fullName).setValue(data.fullName || data.name);
      }

      // Sobrescreve Email se enviado
      if (data.email) {
        sheet.getRange(matchedRowIndex, colMap.email).setValue(data.email);
      }

      // Sobrescreve Telefone se enviado
      if (formattedPhone) {
        sheet.getRange(matchedRowIndex, colMap.phone).setValue(formattedPhone);
      }

      // Sobrescreve dados do Quiz se enviados
      if (data.brandOrStore || data.company) {
        sheet.getRange(matchedRowIndex, colMap.brand).setValue(data.brandOrStore || data.company);
      }
      if (data.monthlyRevenue || data.revenue) {
        sheet.getRange(matchedRowIndex, colMap.revenue).setValue(data.monthlyRevenue || data.revenue);
      }
      if (data.monthlyAdSpend || data.spend) {
        sheet.getRange(matchedRowIndex, colMap.adSpend).setValue(data.monthlyAdSpend || data.spend);
      }
      if (data.bottleneck) {
        sheet.getRange(matchedRowIndex, colMap.bottleneck).setValue(data.bottleneck);
      }
      if (data.role) {
        sheet.getRange(matchedRowIndex, colMap.role).setValue(data.role);
      }

      // Sobrescreve UTMs se enviadas
      if (data.utm_source) sheet.getRange(matchedRowIndex, colMap.utmSource).setValue(data.utm_source);
      if (data.utm_medium) sheet.getRange(matchedRowIndex, colMap.utmMedium).setValue(data.utm_medium);
      if (data.utm_campaign) sheet.getRange(matchedRowIndex, colMap.utmCampaign).setValue(data.utm_campaign);
      if (data.utm_content) sheet.getRange(matchedRowIndex, colMap.utmContent).setValue(data.utm_content);
      if (data.utm_term) sheet.getRange(matchedRowIndex, colMap.utmTerm).setValue(data.utm_term);
      if (data.fbclid) sheet.getRange(matchedRowIndex, colMap.fbclid).setValue(data.fbclid);

      // Atualiza Status de Agendamento:
      if (isBookingConfirmed) {
        sheet.getRange(matchedRowIndex, colMap.scheduled).setValue("Yes");
      } else {
        var currentStatus = sheet.getRange(matchedRowIndex, colMap.scheduled).getValue();
        // Se ainda não estava como 'Yes', define como 'No'
        if (currentStatus !== "Yes") {
          sheet.getRange(matchedRowIndex, colMap.scheduled).setValue("No");
        }
      }

      return responseJson({
        status: "success",
        action: "overwritten_existing_lead",
        row: matchedRowIndex,
        scheduledOnCal: isBookingConfirmed ? "Yes" : sheet.getRange(matchedRowIndex, colMap.scheduled).getValue()
      });
    }

    // ----------------------------------------------------
    // CASO 2: NOVO LEAD (E-MAIL E TELEFONE INÉDITOS) -> INSERE NOVA LINHA
    // ----------------------------------------------------
    var scheduledStatus = isBookingConfirmed ? "Yes" : "No";

    var newRow = [];
    newRow[colMap.timestamp - 1] = data.timestamp || defaultTimestamp;
    newRow[colMap.brand - 1] = data.brandOrStore || data.company || "";
    newRow[colMap.fullName - 1] = data.fullName || data.name || "";
    newRow[colMap.email - 1] = data.email || "";
    newRow[colMap.phone - 1] = formattedPhone;
    newRow[colMap.revenue - 1] = data.monthlyRevenue || data.revenue || "";
    newRow[colMap.adSpend - 1] = data.monthlyAdSpend || data.spend || "";
    newRow[colMap.bottleneck - 1] = data.bottleneck || "";
    newRow[colMap.role - 1] = data.role || "";
    newRow[colMap.scheduled - 1] = scheduledStatus;
    newRow[colMap.utmSource - 1] = data.utm_source || "";
    newRow[colMap.utmMedium - 1] = data.utm_medium || "";
    newRow[colMap.utmCampaign - 1] = data.utm_campaign || "";
    newRow[colMap.utmContent - 1] = data.utm_content || "";
    newRow[colMap.utmTerm - 1] = data.utm_term || "";
    newRow[colMap.fbclid - 1] = data.fbclid || "";

    sheet.appendRow(newRow);

    return responseJson({
      status: "success",
      action: "inserted_new_lead",
      row: sheet.getLastRow(),
      scheduledOnCal: scheduledStatus
    });

  } catch (err) {
    return responseJson({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getColumnMapping(headers) {
  var map = {
    timestamp: 1,
    brand: 2,
    fullName: 3,
    email: 4,
    phone: 5,
    revenue: 6,
    adSpend: 7,
    bottleneck: 8,
    role: 9,
    scheduled: 10,
    utmSource: 11,
    utmMedium: 12,
    utmCampaign: 13,
    utmContent: 14,
    utmTerm: 15,
    fbclid: 16
  };

  for (var c = 0; c < headers.length; c++) {
    var h = (headers[c] || "").toString().toLowerCase().trim();
    var idx = c + 1;

    if (h.indexOf("timestamp") !== -1 || h.indexOf("data") !== -1) map.timestamp = idx;
    else if (h.indexOf("brand") !== -1 || h.indexOf("store") !== -1 || h.indexOf("empresa") !== -1) map.brand = idx;
    else if (h.indexOf("full name") !== -1 || h.indexOf("nome") !== -1 || h.indexOf("name") !== -1) map.fullName = idx;
    else if (h.indexOf("email") !== -1 || h.indexOf("e-mail") !== -1) map.email = idx;
    else if (h.indexOf("phone") !== -1 || h.indexOf("whatsapp") !== -1 || h.indexOf("telefone") !== -1) map.phone = idx;
    else if (h.indexOf("revenue") !== -1 || h.indexOf("faturamento") !== -1) map.revenue = idx;
    else if (h.indexOf("spend") !== -1 || h.indexOf("investimento") !== -1) map.adSpend = idx;
    else if (h.indexOf("bottleneck") !== -1 || h.indexOf("gargalo") !== -1) map.bottleneck = idx;
    else if (h.indexOf("role") !== -1 || h.indexOf("cargo") !== -1) map.role = idx;
    else if (h.indexOf("scheduled") !== -1 || h.indexOf("cal.com") !== -1 || h.indexOf("agendou") !== -1) map.scheduled = idx;
    else if (h.indexOf("source") !== -1) map.utmSource = idx;
    else if (h.indexOf("medium") !== -1) map.utmMedium = idx;
    else if (h.indexOf("campaign") !== -1) map.utmCampaign = idx;
    else if (h.indexOf("content") !== -1) map.utmContent = idx;
    else if (h.indexOf("term") !== -1) map.utmTerm = idx;
    else if (h.indexOf("fbclid") !== -1 || h.indexOf("fbc") !== -1) map.fbclid = idx;
  }

  return map;
}

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
