import { NextRequest, NextResponse } from "next/server";

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

    const timestampFormatted = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Format phone with leading quote if starting with '+' so Google Sheets doesn't parse it as a math formula
    const formattedPhone = phone && phone.startsWith("+") ? `'${phone}` : phone;

    const leadPayload = {
      timestamp: timestampFormatted,
      brandOrStore,
      fullName,
      email,
      phone: formattedPhone,
      monthlyRevenue,
      monthlyAdSpend,
      bottleneck,
      role,
      scheduledOnCal: "No",
      utm_source: utms?.utm_source || "",
      utm_medium: utms?.utm_medium || "",
      utm_campaign: utms?.utm_campaign || "",
      utm_content: utms?.utm_content || "",
      utm_term: utms?.utm_term || "",
      fbclid: utms?.fbclid || "",
    };

    console.log("=== NEW AUDIT QUIZ SUBMISSION (SENDING TO SPREADSHEET) ===", leadPayload);

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
