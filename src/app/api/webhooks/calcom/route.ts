import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { syncLeadToQuoCrm } from "@/lib/quoCrm";

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

    // 1. Handle Ping / Test Webhooks / Cancellations from Cal.com
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

    if (
      rawBody.triggerEvent === "BOOKING_CANCELLED" ||
      rawBody.triggerEvent === "BOOKING_REJECTED"
    ) {
      return NextResponse.json({
        success: true,
        message: "Cancellation/rejection received and ignored for lead creation.",
      });
    }

    const payload = rawBody.payload || rawBody.data || rawBody || {};
    const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];
    const primaryAttendee = attendees[0] || {};
    const responses = payload.responses || payload.userFieldsResponses || {};

    // Collect all metadata locations from Cal.com payload
    const metadata: Record<string, any> = {
      ...(rawBody.metadata || {}),
      ...(rawBody.booking?.metadata || {}),
      ...(payload.metadata || {}),
      ...(payload.booking?.metadata || {}),
    };

    // Helper to extract clean human-readable text from Cal.com responses
    const extractCleanText = (item: any): string => {
      if (item === null || item === undefined) return "";
      let val = typeof item === "object" && "value" in item ? item.value : item;
      if (val === null || val === undefined) return "";
      if (Array.isArray(val)) {
        return val
          .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
          .join(", ")
          .trim();
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
        (lowerKey.includes("phone") ||
          lowerKey.includes("tel") ||
          lowerKey.includes("whatsapp") ||
          lowerLabel.includes("phone")) &&
        !extractedPhone
      ) {
        extractedPhone = stringVal;
      } else if (
        (lowerKey.includes("store") ||
          lowerKey.includes("site") ||
          lowerKey.includes("url") ||
          lowerKey.includes("website") ||
          lowerKey.includes("brand") ||
          lowerKey.includes("loja") ||
          lowerLabel.includes("store") ||
          lowerLabel.includes("website")) &&
        !extractedStore
      ) {
        extractedStore = stringVal;
      } else if (
        (lowerKey.includes("revenue") ||
          lowerKey.includes("faturamento") ||
          lowerLabel.includes("revenue") ||
          lowerLabel.includes("faturamento")) &&
        !extractedRevenue
      ) {
        extractedRevenue = stringVal;
      } else if (
        (lowerKey.includes("spend") ||
          lowerKey.includes("ad spend") ||
          lowerLabel.includes("spend") ||
          lowerLabel.includes("ad spend")) &&
        !extractedAdSpend
      ) {
        extractedAdSpend = stringVal;
      } else if (
        (lowerKey.includes("bottleneck") ||
          lowerKey.includes("preventing") ||
          lowerLabel.includes("bottleneck") ||
          lowerLabel.includes("preventing")) &&
        !extractedBottleneck
      ) {
        extractedBottleneck = stringVal;
      } else if (
        (lowerKey.includes("founder") ||
          lowerKey.includes("decision") ||
          lowerLabel.includes("founder") ||
          lowerLabel.includes("decision maker")) &&
        !extractedDecisionMaker
      ) {
        extractedDecisionMaker = stringVal;
      } else if (
        (lowerKey.includes("qualify") ||
          lowerKey.includes("start") ||
          lowerKey.includes("soon") ||
          lowerLabel.includes("start") ||
          lowerLabel.includes("qualify")) &&
        !extractedTimeline
      ) {
        extractedTimeline = stringVal;
      } else {
        otherAnswers.push({ label: rawLabel, value: stringVal });
      }
    }

    // 3. Extract UTM Parameters & Meta Ad Attribution
    const getMetaOrResponse = (targetKey: string): string => {
      const lowerTarget = targetKey.toLowerCase();
      // Check metadata direct
      if (metadata[targetKey]) return String(metadata[targetKey]).trim();
      for (const [mKey, mVal] of Object.entries(metadata)) {
        if (mKey.toLowerCase() === lowerTarget && mVal) return String(mVal).trim();
      }
      // Check responses
      for (const [rKey, rVal] of Object.entries(responses)) {
        if (rKey.toLowerCase() === lowerTarget) return extractCleanText(rVal);
      }
      return "";
    };

    const utmSource = getMetaOrResponse("utm_source") || (metadata.source ? String(metadata.source) : "");
    const utmMedium = getMetaOrResponse("utm_medium") || (metadata.medium ? String(metadata.medium) : "");
    const utmCampaign = getMetaOrResponse("utm_campaign") || (metadata.campaign ? String(metadata.campaign) : "");
    const utmContent = getMetaOrResponse("utm_content") || (metadata.content ? String(metadata.content) : "");
    const utmTerm = getMetaOrResponse("utm_term") || (metadata.term ? String(metadata.term) : "");
    const fbclid = getMetaOrResponse("fbclid") || getMetaOrResponse("fbc") || (metadata.fbc ? String(metadata.fbc) : "");
    const fbp = getMetaOrResponse("fbp") || (metadata.fbp ? String(metadata.fbp) : "");

    // Fallback to query metadata parameters if not in responses
    if (!extractedStore) extractedStore = getMetaOrResponse("store") || getMetaOrResponse("brand");
    if (!extractedRevenue) extractedRevenue = getMetaOrResponse("revenue");
    if (!extractedAdSpend) extractedAdSpend = getMetaOrResponse("spend") || getMetaOrResponse("adspend");
    if (!extractedBottleneck) extractedBottleneck = getMetaOrResponse("bottleneck");
    if (!extractedDecisionMaker) extractedDecisionMaker = getMetaOrResponse("role") || getMetaOrResponse("decision");
    if (!extractedPhone) extractedPhone = getMetaOrResponse("phone");

    // Also parse notes string if passed from Typeform
    const combinedNotes = `${payload.description || ""} ${payload.additionalNotes || ""} ${metadata.notes || ""}`.trim();
    if (combinedNotes) {
      if (!extractedStore && combinedNotes.includes("Brand/Store:")) {
        extractedStore = combinedNotes.split("Brand/Store:")[1]?.split("|")[0]?.trim() || "";
      }
      if (!extractedRevenue && combinedNotes.includes("Revenue:")) {
        extractedRevenue = combinedNotes.split("Revenue:")[1]?.split("|")[0]?.trim() || "";
      }
      if (!extractedAdSpend && combinedNotes.includes("Ad Spend:")) {
        extractedAdSpend = combinedNotes.split("Ad Spend:")[1]?.split("|")[0]?.trim() || "";
      }
      if (!extractedBottleneck && combinedNotes.includes("Bottleneck:")) {
        extractedBottleneck = combinedNotes.split("Bottleneck:")[1]?.split("|")[0]?.trim() || "";
      }
      if (!extractedDecisionMaker && combinedNotes.includes("Role:")) {
        extractedDecisionMaker = combinedNotes.split("Role:")[1]?.split("|")[0]?.trim() || "";
      }
      if (!extractedPhone && combinedNotes.includes("Phone:")) {
        extractedPhone = combinedNotes.split("Phone:")[1]?.split("|")[0]?.trim() || "";
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
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    // Build a clean, professional Role summary for Quo with Ad Attribution
    const roleSummaryParts: string[] = [];
    if (extractedDecisionMaker) {
      roleSummaryParts.push(
        extractedDecisionMaker.includes("Yes") || extractedDecisionMaker.includes("only")
          ? "Founder & Decision Maker"
          : extractedDecisionMaker
      );
    } else {
      roleSummaryParts.push("Growth Audit Lead");
    }
    if (extractedRevenue) roleSummaryParts.push(`Rev: ${extractedRevenue}`);
    if (extractedAdSpend) roleSummaryParts.push(`Spend: ${extractedAdSpend}`);

    // Add immediate visual Ad Attribution badge to the contact card
    const adAttributionParts: string[] = [];
    if (utmCampaign) adAttributionParts.push(`Campaign: ${utmCampaign}`);
    if (utmContent) adAttributionParts.push(`Ad: ${utmContent}`);
    if (utmSource && !utmCampaign) adAttributionParts.push(`Src: ${utmSource}`);
    if (adAttributionParts.length > 0) {
      roleSummaryParts.push(`🎯 ${adAttributionParts.join(" • ")}`);
    }

    if (meetingDateStr) roleSummaryParts.push(`Call: ${meetingDateStr}`);

    const role = roleSummaryParts.join(" • ");

    const emailsList = email ? [{ name: "work", value: email }] : [];
    const phonesList = phone ? [{ name: "work", value: phone }] : [];

    // Construct full attribution URL
    const attributionUrlParams = new URLSearchParams();
    if (utmSource) attributionUrlParams.set("utm_source", utmSource);
    if (utmMedium) attributionUrlParams.set("utm_medium", utmMedium);
    if (utmCampaign) attributionUrlParams.set("utm_campaign", utmCampaign);
    if (utmContent) attributionUrlParams.set("utm_content", utmContent);
    if (utmTerm) attributionUrlParams.set("utm_term", utmTerm);
    if (fbclid) attributionUrlParams.set("fbclid", fbclid);

    const qs = attributionUrlParams.toString();
    const landingPageWithUtms = qs
      ? `https://ecom.rarityagency.io/?${qs}`
      : "https://ecom.rarityagency.io";

    const sourceUrl = extractedStore
      ? extractedStore.startsWith("http")
        ? extractedStore
        : `https://${extractedStore}`
      : landingPageWithUtms;

    // Contact source label for Quo
    let sourceLabel = "Cal.com Growth Audit";
    if (utmCampaign) {
      sourceLabel = `Meta Ads (${utmCampaign})`;
    } else if (utmSource) {
      sourceLabel = `Paid Ad (${utmSource})`;
    }

    // 4. Sync/Upsert Contact to Quo (OpenPhone) CRM
    const quoResult = await syncLeadToQuoCrm({
      fullName: rawName,
      email,
      phone,
      brandOrStore: extractedStore,
      company: company !== "Ecom Brand" ? company : undefined,
      monthlyRevenue: extractedRevenue,
      monthlyAdSpend: extractedAdSpend,
      bottleneck: extractedBottleneck,
      role: extractedDecisionMaker,
      meetingDate: meetingDateStr,
      scheduledOnCal: "Yes",
      timeZone: primaryAttendee.timeZone || "America/Sao_Paulo",
      utms: {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        fbclid: fbclid,
      },
      source: sourceLabel,
      sourceUrl: sourceUrl,
    });

    // 6. Server-Side Meta Conversions API (CAPI) Dispatch
    let capiResult: any = null;
    if (META_PIXEL_ID && META_CAPI_ACCESS_TOKEN && email) {
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

        // Pass Meta Click ID (fbc) and Browser ID (fbp) for maximum match quality
        if (fbclid) {
          userDataPayload.fbc = fbclid.startsWith("fb.1.")
            ? fbclid
            : `fb.1.${currentTimestamp}.${fbclid}`;
        }
        if (fbp) {
          userDataPayload.fbp = fbp;
        }

        const customDataPayload: Record<string, any> = {
          content_name: "Free Growth Audit",
          currency: "USD",
          value: 0,
        };
        if (utmSource) customDataPayload.utm_source = utmSource;
        if (utmCampaign) customDataPayload.utm_campaign = utmCampaign;
        if (utmMedium) customDataPayload.utm_medium = utmMedium;
        if (utmContent) customDataPayload.utm_content = utmContent;
        if (utmTerm) customDataPayload.utm_term = utmTerm;

        const capiEvents = [
          {
            event_name: "Schedule",
            event_time: currentTimestamp,
            action_source: "website",
            event_source_url: landingPageWithUtms,
            user_data: userDataPayload,
            custom_data: customDataPayload,
          },
          {
            event_name: "Lead",
            event_time: currentTimestamp,
            action_source: "website",
            event_source_url: landingPageWithUtms,
            user_data: userDataPayload,
            custom_data: customDataPayload,
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

    // 7. Update Google Sheets: Mark "Scheduled on Cal.com?" as Yes with verified Cal.com data
    const sheetsWebhookUrl =
      process.env.GOOGLE_SHEETS_AUDIT_WEBHOOK_URL ||
      process.env.GOOGLE_SHEETS_ONBOARDING_WEBHOOK_URL;

    if (sheetsWebhookUrl && sheetsWebhookUrl.startsWith("http") && email) {
      try {
        const formattedPhone = phone && phone.startsWith("+") ? `'${phone}` : phone;
        const sheetUpdatePayload = {
          action: "update_booking_status",
          email: email,
          phone: formattedPhone,
          name: rawName,
          fullName: rawName,
          company: company,
          brandOrStore: extractedStore || company,
          monthlyRevenue: extractedRevenue,
          monthlyAdSpend: extractedAdSpend,
          bottleneck: extractedBottleneck,
          role: extractedDecisionMaker,
          scheduledOnCal: "Yes",
          meetingDate: meetingDateStr,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          fbclid: fbclid,
        };

        await fetch(sheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetUpdatePayload),
          redirect: "follow",
        });
        console.log("✅ [Google Sheets] Updated lead booking status to Scheduled for:", email);
      } catch (sheetErr) {
        console.error("Error updating Google Sheet booking status:", sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead successfully synced to Quo CRM, Meta Conversions API, and Google Sheets",
      contactId: quoResult?.data?.id,
      metaCapi: capiResult,
      attribution: {
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        fbclid,
        landingPageWithUtms,
      },
      leadSummary: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        company,
        role,
        source: sourceLabel,
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
