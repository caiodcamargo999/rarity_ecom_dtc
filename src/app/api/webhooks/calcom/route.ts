import { NextRequest, NextResponse } from "next/server";

const QUO_API_KEY =
  process.env.QUO_API_KEY ||
  "518659b06aa369d73f592a77aa0e50cac29a5900119d69561b07bac762d6a066";

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Cal.com to Quo CRM webhook endpoint is live and ready.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Handle Ping / Test Webhooks from Cal.com
    if (
      rawBody.triggerEvent === "PING" ||
      rawBody.ping === true ||
      rawBody.type === "PING" ||
      (!rawBody.payload && !rawBody.attendees && !rawBody.data)
    ) {
      return NextResponse.json({
        success: true,
        message: "Ping received successfully!",
      });
    }

    const payload = rawBody.payload || rawBody.data || rawBody || {};
    const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];
    const primaryAttendee = attendees[0] || {};
    const responses = payload.responses || payload.userFieldsResponses || {};

    // 2. Comprehensive Field Extraction from Cal.com Responses
    let extractedName = "";
    let extractedEmail = "";
    let extractedPhone = "";
    let extractedStore = "";
    let extractedRevenue = "";
    const otherAnswers: string[] = [];

    // Scan all keys/values inside responses
    for (const [key, item] of Object.entries(responses)) {
      const val =
        typeof item === "object" && item !== null && "value" in item
          ? (item as any).value
          : item;

      if (!val || (typeof val === "object" && Object.keys(val).length === 0)) continue;

      const lowerKey = key.toLowerCase();
      // Handle nested values if object
      const stringVal =
        typeof val === "object"
          ? JSON.stringify(val)
          : String(val).trim();

      if (!stringVal) continue;

      if (lowerKey.includes("name") && !extractedName) {
        extractedName = stringVal;
      } else if (lowerKey.includes("email") && !extractedEmail) {
        extractedEmail = stringVal;
      } else if (
        (lowerKey.includes("phone") || lowerKey.includes("tel") || lowerKey.includes("whatsapp")) &&
        !extractedPhone
      ) {
        extractedPhone = stringVal;
      } else if (
        (lowerKey.includes("store") || lowerKey.includes("site") || lowerKey.includes("url") || lowerKey.includes("website") || lowerKey.includes("brand") || lowerKey.includes("loja")) &&
        !extractedStore
      ) {
        extractedStore = stringVal;
      } else if (
        (lowerKey.includes("revenue") || lowerKey.includes("faturamento") || lowerKey.includes("spend") || lowerKey.includes("monthly")) &&
        !extractedRevenue
      ) {
        extractedRevenue = stringVal;
      } else {
        const rawLabel =
          typeof item === "object" && item !== null && "label" in item
            ? (item as any).label
            : key;
        const cleanLabel = String(rawLabel).replace(/[*:]/g, "").trim();
        otherAnswers.push(`${cleanLabel}: ${stringVal}`);
      }
    }

    // Also check description / additional notes fields
    if (payload.description && !otherAnswers.some((a) => a.includes(payload.description))) {
      otherAnswers.push(`Note: ${payload.description}`);
    }
    if (payload.additionalNotes && !otherAnswers.some((a) => a.includes(payload.additionalNotes))) {
      otherAnswers.push(`Notes: ${payload.additionalNotes}`);
    }

    // Fallbacks from attendee objects if not extracted from responses
    const rawName = extractedName || primaryAttendee.name || payload.name || "Growth Audit Lead";
    const email = extractedEmail || primaryAttendee.email || payload.email || "";
    const phone =
      extractedPhone ||
      primaryAttendee.phoneNumber ||
      primaryAttendee.phone ||
      "";

    // Split First Name & Last Name
    const nameParts = rawName.trim().split(" ");
    const firstName = nameParts[0] || "Growth";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Company / Store name formatting
    const company = extractedStore
      ? extractedStore.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "Ecom Brand";

    // Format Meeting Date/Time for quick view
    const meetingDateStr = payload.startTime
      ? new Date(payload.startTime).toLocaleString("pt-BR", {
          timeZone: primaryAttendee.timeZone || "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Build Role field in Quo (summarizes key qualifiers, Revenue, Call Time AND all Long Text answers)
    const roleParts: string[] = [];
    if (extractedRevenue) roleParts.push(`Rev: ${extractedRevenue}`);
    if (meetingDateStr) roleParts.push(`Call: ${meetingDateStr}`);
    if (otherAnswers.length > 0) {
      roleParts.push(...otherAnswers);
    }
    const role = roleParts.join(" • ") || "Free Growth Audit Lead";

    // Prepare Quo Contact structure
    const emailsList = email ? [{ name: "work", value: email }] : [];
    const phonesList = phone ? [{ name: "work", value: phone }] : [];

    const sourceUrl = extractedStore.startsWith("http")
      ? extractedStore
      : extractedStore
      ? `https://${extractedStore}`
      : "https://ecom.rarityagency.io";

    // Check if Quo workspace has any custom fields configured
    let customFieldsPayload: Array<{ key: string; value: string }> = [];
    try {
      const customFieldsRes = await fetch("https://api.openphone.com/v1/contact-custom-fields", {
        headers: { Authorization: QUO_API_KEY },
      });
      if (customFieldsRes.ok) {
        const customFieldsData = await customFieldsRes.json();
        const availableFields = customFieldsData.data || [];
        for (const field of availableFields) {
          const fieldKey = field.key;
          const fieldName = (field.name || "").toLowerCase();
          // Match if custom field matches notes, answers or long text
          const matchingAnswer = otherAnswers.find((a) =>
            a.toLowerCase().includes(fieldName)
          );
          if (matchingAnswer) {
            customFieldsPayload.push({
              key: fieldKey,
              value: matchingAnswer.split(": ").slice(1).join(": "),
            });
          } else if (fieldName.includes("note") || fieldName.includes("resposta") || fieldName.includes("obs")) {
            customFieldsPayload.push({
              key: fieldKey,
              value: otherAnswers.join("\n"),
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch custom fields from Quo:", err);
    }

    const quoPayload: Record<string, any> = {
      source: "Cal.com Growth Audit",
      sourceUrl: sourceUrl,
      defaultFields: {
        firstName,
        lastName,
        company,
        role,
        emails: emailsList,
        phoneNumbers: phonesList,
      },
    };

    if (customFieldsPayload.length > 0) {
      quoPayload.customFields = customFieldsPayload;
    }

    // 3. Post to Quo (OpenPhone) API
    const quoResponse = await fetch("https://api.openphone.com/v1/contacts", {
      method: "POST",
      headers: {
        Authorization: QUO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoPayload),
    });

    const quoResult = await quoResponse.json();

    if (!quoResponse.ok) {
      console.error("Error creating contact in Quo:", quoResult);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create contact in Quo",
          details: quoResult,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact successfully created in Quo CRM",
      contactId: quoResult.data?.id,
      leadSummary: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        company,
        role,
        sourceUrl,
        otherAnswers,
      },
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
