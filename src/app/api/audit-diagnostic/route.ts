import { NextRequest, NextResponse } from "next/server";
import { syncLeadToQuoCrm } from "@/lib/quoCrm";
import crypto from "crypto";

// Helper function to hash user data as required by Meta CAPI
function hashData(data: string) {
  if (!data) return undefined;
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
}

async function sendToMetaCAPI(payload: any, utms: any, req: NextRequest) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  // Only run if credentials exist and it's a booking action
  if (!pixelId || !accessToken || payload.scheduledOnCal !== "Yes") {
    return;
  }

  const clientIpAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  const clientUserAgent = req.headers.get("user-agent") || "";
  const eventTime = Math.floor(Date.now() / 1000);
  
  const fbc = utms?.fbc || (payload.fbclid ? `fb.1.${eventTime * 1000}.${payload.fbclid}` : undefined);
  const fbp = utms?.fbp;

  const eventData: any = {
    data: [
      {
        event_name: "Schedule",
        event_time: eventTime,
        action_source: "website",
        event_source_url: req.url,
        user_data: {
          client_ip_address: clientIpAddress,
          client_user_agent: clientUserAgent,
          em: payload.email ? [hashData(payload.email)] : undefined,
          ph: payload.phone ? [hashData(payload.phone.replace(/[^0-9\+]/g, ''))] : undefined,
          fn: payload.fullName ? [hashData(payload.fullName.split(" ")[0])] : undefined,
          ln: payload.fullName && payload.fullName.split(" ").length > 1 ? [hashData(payload.fullName.split(" ").slice(1).join(" "))] : undefined,
          fbc: fbc,
          fbp: fbp,
        },
        custom_data: {
          currency: "USD",
          value: 0,
        },
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    eventData.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("✅ [Meta CAPI] 'Schedule' event successfully sent to Meta:", result);
    } else {
      console.error("❌ [Meta CAPI] Error response from Meta:", result);
    }
  } catch (error) {
    console.error("❌ [Meta CAPI] Exception sending event:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      brandOrStore = "",
      monthlyRevenue = "",
      monthlyAdSpend = "",
      bottleneck = "",
      role = "",
      fullName = "",
      email = "",
      phone = "",
      utms = {},
    } = data;

    // Reject incomplete empty submissions (e.g., keystroke events with no contact info)
    if (!email?.trim() && !phone?.trim() && !fullName?.trim()) {
      return NextResponse.json(
        { success: false, message: "Ignored: No contact information provided" },
        { status: 400 }
      );
    }

    const timestampFormatted = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Format phone with leading quote if starting with '+' so Google Sheets doesn't parse it as a math formula
    const formattedPhone = phone && phone.startsWith("+") ? `'${phone}` : phone;

    const scheduledOnCal = data.scheduledOnCal || (data.action === "update_booking_status" ? "Yes" : "No");
    const action = data.action || (scheduledOnCal === "Yes" ? "update_booking_status" : "insert_lead");

    const leadPayload = {
      action,
      timestamp: timestampFormatted,
      brandOrStore,
      fullName,
      email,
      phone: formattedPhone,
      monthlyRevenue,
      monthlyAdSpend,
      bottleneck,
      role,
      scheduledOnCal,
      meetingDate: data.meetingDate || "",
      utm_source: utms?.utm_source || "",
      utm_medium: utms?.utm_medium || "",
      utm_campaign: utms?.utm_campaign || "",
      utm_content: utms?.utm_content || "",
      utm_term: utms?.utm_term || "",
      fbclid: utms?.fbclid || "",
    };

    console.log(`=== AUDIT LEAD [${action}] (SENDING TO SPREADSHEET) ===`, leadPayload);

    // 1. Send to Google Sheets Webhook
    const sheetsWebhookUrl =
      process.env.GOOGLE_SHEETS_AUDIT_WEBHOOK_URL ||
      process.env.GOOGLE_SHEETS_ONBOARDING_WEBHOOK_URL;

    let sheetSynced = false;
    if (sheetsWebhookUrl && sheetsWebhookUrl.startsWith("http")) {
      try {
        const response = await fetch(sheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
          redirect: "follow",
        });

        if (response.ok) {
          sheetSynced = true;
          console.log("✅ [Google Sheets] Lead successfully synced to spreadsheet");
        } else {
          console.error(`[Google Sheets] Response error: ${response.status} ${response.statusText}`);
        }
      } catch (sheetErr) {
        console.error("Error sending lead to Google Sheets:", sheetErr);
      }
    } else {
      console.log("ℹ️ [Google Sheets] GOOGLE_SHEETS_AUDIT_WEBHOOK_URL not configured yet. Payload logged in console.");
    }

    // 2. Sync to Quo CRM (with all custom fields: Revenue, Spend, Bottleneck, Role, Call Date/Time)
    syncLeadToQuoCrm({
      fullName,
      email,
      phone,
      brandOrStore,
      monthlyRevenue,
      monthlyAdSpend,
      bottleneck,
      role,
      meetingDate: data.meetingDate || undefined,
      timeZone: data.timeZone || "America/Sao_Paulo",
      scheduledOnCal,
      utms,
      source: "Growth Diagnostic Website",
      sourceUrl: brandOrStore ? `https://${brandOrStore.replace(/^https?:\/\//, "")}` : "https://rarityagency.com",
    }).catch((quoErr) => {
      console.error("Error syncing contact to Quo CRM in background:", quoErr);
    });

    // 3. Send to Meta Conversions API (Server-Side Tracking)
    await sendToMetaCAPI(leadPayload, utms, req);

    return NextResponse.json({
      success: true,
      message: "Quiz submission recorded successfully",
      sheetSynced,
    });
  } catch (err: any) {
    console.error("Error processing diagnostic quiz:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
