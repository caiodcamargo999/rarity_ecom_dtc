/**
 * RARITY AGENCY - GOOGLE APPS SCRIPT
 * Sincronização Inteligente de Leads & Agendamentos (Cal.com + Typeform/Quiz)
 *
 * FLUXO COMPLETO:
 * 1. Ao clicar em "Select Date & Time" no Quiz:
 *    -> SEMPRE INSERE UMA NOVA LINHA com "Scheduled on Cal.com?" = "No".
 * 2. Ao confirmar o agendamento no Cal.com:
 *    -> LOCALIZA A LINHA DO LEAD (por E-mail ou Telefone) e muda para "Yes".
 *    -> Atualiza Nome, E-mail e Telefone com os dados oficiais do Cal.com.
 *    -> NÃO DUPLICA LINHAS!
 * 3. Se alguém agendar direto no Cal.com sem passar pelo Quiz:
 *    -> Insere uma nova linha já marcada como "Yes".
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

    // Cabeçalhos esperados (Row 1):
    // A: Timestamp | B: Brand / Store URL | C: Full Name | D: Email | E: Phone / WhatsApp |
    // F: Monthly Revenue | G: Monthly Ad Spend | H: Bottleneck | I: Role |
    // J: Scheduled on Cal.com? | K: UTM Source | L: UTM Medium | M: UTM Campaign |
    // N: UTM Content | O: UTM Term | P: FBCLID

    var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 16)).getValues()[0];
    var colMap = getColumnMapping(headers);

    var incomingEmail = (data.email || "").toString().trim().toLowerCase();
    var incomingPhoneDigits = (data.phone || "").toString().replace(/[^0-9]/g, "");
    var isBookingConfirmed = (data.scheduledOnCal === "Yes" || data.action === "update_booking_status");

    var lastRow = sheet.getLastRow();
    var matchedRowIndex = -1;

    var now = new Date();
    var defaultTimestamp = Utilities.formatDate(now, "America/New_York", "MMM dd, yyyy, h:mm a");
    var formattedPhone = data.phone ? (data.phone.toString().startsWith("+") ? "'" + data.phone : data.phone) : "";

    // ----------------------------------------------------
    // CASO 1: AGENDAMENTO CONFIRMADO NO CAL.COM
    // ----------------------------------------------------
    if (isBookingConfirmed) {
      if (lastRow > 1) {
        var emailValues = sheet.getRange(2, colMap.email, lastRow - 1, 1).getValues();
        var phoneValues = sheet.getRange(2, colMap.phone, lastRow - 1, 1).getValues();

        // Busca do lead mais recente para o mais antigo (de baixo para cima)
        for (var i = emailValues.length - 1; i >= 0; i--) {
          var rowEmail = (emailValues[i][0] || "").toString().trim().toLowerCase();
          var rowPhoneDigits = (phoneValues[i][0] || "").toString().replace(/[^0-9]/g, "");

          // 1) Match por E-mail
          if (incomingEmail && rowEmail === incomingEmail) {
            matchedRowIndex = i + 2;
            break;
          }

          // 2) Match por Telefone
          if (incomingPhoneDigits && incomingPhoneDigits.length >= 8 && rowPhoneDigits && rowPhoneDigits.length >= 8) {
            if (rowPhoneDigits.indexOf(incomingPhoneDigits) !== -1 || incomingPhoneDigits.indexOf(rowPhoneDigits) !== -1) {
              matchedRowIndex = i + 2;
              break;
            }
          }
        }
      }

      // Se encontrou o lead criado previamente no quiz, atualiza para 'Yes' SEM DUPLICAR
      if (matchedRowIndex > 1) {
        sheet.getRange(matchedRowIndex, colMap.scheduled).setValue("Yes");

        // Cal.com é a fonte verídica: atualiza Nome, Email e Telefone
        if (data.fullName || data.name) {
          sheet.getRange(matchedRowIndex, colMap.fullName).setValue(data.fullName || data.name);
        }
        if (data.email) {
          sheet.getRange(matchedRowIndex, colMap.email).setValue(data.email);
        }
        if (formattedPhone) {
          sheet.getRange(matchedRowIndex, colMap.phone).setValue(formattedPhone);
        }

        return responseJson({
          status: "success",
          action: "updated_existing_lead_to_scheduled",
          row: matchedRowIndex,
          scheduledOnCal: "Yes"
        });
      }
    }

    // ----------------------------------------------------
    // CASO 2: NOVO ENVIO DO DIAGNÓSTICO (OU AGENDAMENTO DIRETO)
    // -> SEMPRE CRIA UMA NOVA LINHA NA PLANILHA
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
    return responseJson({
      status: "error",
      message: err.toString()
    });
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
