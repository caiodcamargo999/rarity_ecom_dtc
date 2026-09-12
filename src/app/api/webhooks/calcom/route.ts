import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const QUO_API_KEY =
  process.env.QUO_API_KEY ||
  "518659b06aa369d73f592a77aa0e50cac29a5900119d69561b07bac762d6a066";

const META_PIXEL_ID = process.env.META_PIXEL_ID || "4027141757421207";
const META_CAPI_ACCESS_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN ||
  "EAAWhuxhVMfQBSWSWSsAN94jzy6g0CiU424ogoqA8wgzwrv476G0woZCaHw4m6w1KKkVnu830XRFtZAycywb5TZBLgW64wPTMJaVRp4vgZBQYMlMrwyPwJVb9llegifGhXt0DvUcckauZA6Od5KZBDaLqI33OgZAtNsDfsUpWUWU91UwVCFieUjYaTm1IRQsdBJmEQZDZD";

function hashSha256(value: string): string {
  if (!value) return "";
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Cal.com to Quo CRM & Meta CAPI webhook endpoint is live and ready.",
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

    // Helper to extract clean human-readable text from Cal.com responses
    const extractCleanText = (item: any): string => {
      if (item === null || item === undefined) return "";
      let val = typeof item === "object" && "value" in item ? item.value : item;
      if (val === null || val === undefined) return "";
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ").trim();
      }
      if (typeof val === "object") {
        if (item.label && !item.isHidden && Object.keys(val).length > 0) {
          return JSON.stringify(val);
        }
        return "";
      }
      return String(val).trim();
    };

    // 2. Comprehensive Field Extraction from Cal.com Responses
    let extractedName = "";
    let extractedEmail = "";
    let extractedPhone = "";
    let extractedStore = "";
    let extractedRevenue = "";
    let extractedAdSpend = "";
    let extractedBottleneck = "";
    let extractedDecisionMaker = "";
    let extractedTimeline = "";
    const otherAnswers: { label: string; value: string }[] = [];

    // Ignored Cal.com internal / hidden fields
    const ignoredKeys = [
      "location",
      "what_is_this_meeting_about",
      "additional_notes",
      "reason_for_reschedule",
      "reschedulereason",
      "guests",
      "system",
    ];

    for (const [key, item] of Object.entries(responses)) {
      const lowerKey = key.toLowerCase();
      if (ignoredKeys.includes(lowerKey)) continue;
      if (typeof item === "object" && item !== null && (item as any).isHidden) continue;

      const stringVal = extractCleanText(item);
      if (!stringVal) continue;

      const rawLabel =
        typeof item === "object" && item !== null && "label" in item
          ? String((item as any).label).replace(/[*:]/g, "").trim()
          : key;
      const lowerLabel = rawLabel.toLowerCase();

      if ((lowerKey.includes("name") || lowerLabel.includes("name")) && !extractedName) {
        extractedName = stringVal;
      } else if ((lowerKey.includes("email") || lowerLabel.includes("email")) && !extractedEmail) {
        extractedEmail = stringVal;
      } else if (
        (lowerKey.includes("phone") || lowerKey.includes("tel") || lowerKey.includes("whatsapp") || lowerLabel.includes("phone")) &&
        !extractedPhone
      ) {
        extractedPhone = stringVal;
      } else if (
        (lowerKey.includes("store") || lowerKey.includes("site") || lowerKey.includes("url") || lowerKey.includes("website") || lowerKey.includes("brand") || lowerKey.includes("loja") || lowerLabel.includes("store") || lowerLabel.includes("website")) &&
        !extractedStore
      ) {
        extractedStore = stringVal;
      } else if (
        (lowerKey.includes("revenue") || lowerKey.includes("faturamento") || lowerLabel.includes("revenue") || lowerLabel.includes("faturamento")) &&
        !extractedRevenue
      ) {
        extractedRevenue = stringVal;
      } else if (
        (lowerKey.includes("spend") || lowerKey.includes("ad spend") || lowerLabel.includes("spend") || lowerLabel.includes("ad spend")) &&
        !extractedAdSpend
      ) {
        extractedAdSpend = stringVal;
      } else if (
        (lowerKey.includes("bottleneck") || lowerKey.includes("preventing") || lowerLabel.includes("bottleneck") || lowerLabel.includes("preventing")) &&
        !extractedBottleneck
      ) {
        extractedBottleneck = stringVal;
      } else if (
        (lowerKey.includes("founder") || lowerKey.includes("decision") || lowerLabel.includes("founder") || lowerLabel.includes("decision maker")) &&
        !extractedDecisionMaker
      ) {
        extractedDecisionMaker = stringVal;
      } else if (
        (lowerKey.includes("qualify") || lowerKey.includes("start") || lowerKey.includes("soon") || lowerLabel.includes("start") || lowerLabel.includes("qualify")) &&
        !extractedTimeline
      ) {
        extractedTimeline = stringVal;
      } else {
        otherAnswers.push({ label: rawLabel, value: stringVal });
      }
    }

    if (payload.description && !ignoredKeys.includes(payload.description.toLowerCase())) {
      otherAnswers.push({ label: "Description", value: payload.description });
    }
    if (payload.additionalNotes && !ignoredKeys.includes(payload.additionalNotes.toLowerCase())) {
      otherAnswers.push({ label: "Notes", value: payload.additionalNotes });
    }

    const rawName = extractedName || primaryAttendee.name || payload.name || "Growth Audit Lead";
    const email = extractedEmail || primaryAttendee.email || payload.email || "";
    const phone =
      extractedPhone ||
      primaryAttendee.phoneNumber ||
      primaryAttendee.phone ||
      "";

    const nameParts = rawName.trim().split(" ");
    const firstName = nameParts[0] || "Growth";
    const lastName = nameParts.slice(1).join(" ") || "";

    const company = extractedStore
      ? extractedStore.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "Ecom Brand";

    const meetingDateStr = payload.startTime
      ? new Date(payload.startTime).toLocaleString("pt-BR", {
          timeZone: primaryAttendee.timeZone || "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Build a clean, professional Role summary for Quo
    const roleSummaryParts: string[] = [];
    if (extractedDecisionMaker) {
      roleSummaryParts.push(extractedDecisionMaker.includes("Yes") || extractedDecisionMaker.includes("only") ? "Founder & Decision Maker" : extractedDecisionMaker);
    } else {
      roleSummaryParts.push("Growth Audit Lead");
    }
    if (extractedRevenue) roleSummaryParts.push(`Rev: ${extractedRevenue}`);
    if (extractedAdSpend) roleSummaryParts.push(`Spend: ${extractedAdSpend}`);
    if (meetingDateStr) roleSummaryParts.push(`Call: ${meetingDateStr}`);

    const role = roleSummaryParts.join(" • ");

    const emailsList = email ? [{ name: "work", value: email }] : [];
    const phonesList = phone ? [{ name: "work", value: phone }] : [];

    const sourceUrl = extractedStore.startsWith("http")
      ? extractedStore
      : extractedStore
      ? `https://${extractedStore}`
      : "https://ecom.rarityagency.io";

    // 3. Map to Quo Custom Fields (Dynamic and Fallback)
    const customPropertyKeyMap: Record<string, string> = {
      revenue: "6aa567aea21ae4b5e1663735", // Monthly Revenue
      spend: "6aa568faa21ae4b5e166373b", // Monthly Ad Spend
      bottleneck: "6aa56931a21ae4b5e1663741", // Scalling Bottleneck
      decision: "6aa56946a21ae4b5e1663747", // Decision Maker
      start: "6aa56a24a21ae4b5e166374d", // Ready to Start
      call: "6aa56a5aa21ae4b5e1663753", // Call Date and Time
    };

    // Try to fetch existing custom fields dynamically from Quo to ensure accurate key mapping
    try {
      const cfResponse = await fetch("https://api.openphone.com/v1/contact-custom-fields", {
        headers: { Authorization: QUO_API_KEY },
      });
      if (cfResponse.ok) {
        const cfData = await cfResponse.json();
        const fields = cfData?.data || [];
        for (const f of fields) {
          const nameLower = (f.name || "").toLowerCase();
          if (nameLower.includes("revenue") || nameLower.includes("faturamento")) {
            customPropertyKeyMap.revenue = f.key;
          } else if (nameLower.includes("spend") || nameLower.includes("ad spend")) {
            customPropertyKeyMap.spend = f.key;
          } else if (nameLower.includes("bottleneck") || nameLower.includes("scalling") || nameLower.includes("scaling")) {
            customPropertyKeyMap.bottleneck = f.key;
          } else if (nameLower.includes("decision") || nameLower.includes("founder")) {
            customPropertyKeyMap.decision = f.key;
          } else if (nameLower.includes("ready") || nameLower.includes("start")) {
            customPropertyKeyMap.start = f.key;
          } else if (nameLower.includes("call") || nameLower.includes("date") || nameLower.includes("time")) {
            customPropertyKeyMap.call = f.key;
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch custom fields schema dynamically, using fallback keys", e);
    }

    const customFieldsPayload: { key: string; value: string }[] = [];
    if (extractedRevenue && customPropertyKeyMap.revenue) {
      customFieldsPayload.push({ key: customPropertyKeyMap.revenue, value: extractedRevenue });
    }
    if (extractedAdSpend && customPropertyKeyMap.spend) {
      customFieldsPayload.push({ key: customPropertyKeyMap.spend, value: extractedAdSpend });
    }
    if (extractedBottleneck && customPropertyKeyMap.bottleneck) {
      customFieldsPayload.push({ key: customPropertyKeyMap.bottleneck, value: extractedBottleneck });
    }
    if (extractedDecisionMaker && customPropertyKeyMap.decision) {
      customFieldsPayload.push({ key: customPropertyKeyMap.decision, value: extractedDecisionMaker });
    }
    if (extractedTimeline && customPropertyKeyMap.start) {
      customFieldsPayload.push({ key: customPropertyKeyMap.start, value: extractedTimeline });
    }
    if (payload.startTime && customPropertyKeyMap.call) {
      customFieldsPayload.push({ key: customPropertyKeyMap.call, value: new Date(payload.startTime).toISOString() });
    }

    // 4. Post to Quo (OpenPhone) API
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
      customFields: customFieldsPayload,
    };

    let quoResult: any = null;
    try {
      const quoResponse = await fetch("https://api.openphone.com/v1/contacts", {
        method: "POST",
        headers: {
          Authorization: QUO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoPayload),
      });
      quoResult = await quoResponse.json();
    } catch (err) {
      console.error("Error creating contact in Quo:", err);
    }

    // 4. Server-Side Meta Conversions API (CAPI) Dispatch
    let capiResult: any = null;
    if (META_PIXEL_ID && META_CAPI_ACCESS_TOKEN) {
      try {
        const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "";
        const clientUserAgent = req.headers.get("user-agent") || "";
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const userDataPayload: Record<string, any> = {};
        if (email) userDataPayload.em = [hashSha256(email)];
        if (phone) userDataPayload.ph = [hashSha256(phone.replace(/[^0-9]/g, ""))];
        if (firstName) userDataPayload.fn = [hashSha256(firstName)];
        if (lastName) userDataPayload.ln = [hashSha256(lastName)];
        if (clientIp) userDataPayload.client_ip_address = clientIp;
        if (clientUserAgent) userDataPayload.client_user_agent = clientUserAgent;

        const capiEvents = [
          {
            event_name: "Schedule",
            event_time: currentTimestamp,
            action_source: "website",
            event_source_url: "https://ecom.rarityagency.io",
            user_data: userDataPayload,
            custom_data: {
              content_name: "Free Growth Audit",
              currency: "USD",
              value: 0,
            },
          },
          {
            event_name: "Lead",
            event_time: currentTimestamp,
            action_source: "website",
            event_source_url: "https://ecom.rarityagency.io",
            user_data: userDataPayload,
            custom_data: {
              content_name: "Free Growth Audit",
              currency: "USD",
              value: 0,
            },
          },
        ];

        const capiRes = await fetch(
          `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: capiEvents }),
          }
        );
        capiResult = await capiRes.json();
        console.log("✅ [Meta CAPI] Server-side event sent:", capiResult);
      } catch (capiErr) {
        console.error("Meta CAPI dispatch error:", capiErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead successfully synced to Quo CRM and Meta Conversions API",
      contactId: quoResult?.data?.id,
      metaCapi: capiResult,
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
