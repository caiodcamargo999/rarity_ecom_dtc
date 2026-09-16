import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    const formatField = (val: any) => {
      if (Array.isArray(val)) {
        return val.join(", ");
      }
      return val ? String(val).trim() : "";
    };

    const submission = {
      submittedAt: rawData.submittedAt || new Date().toISOString(),
      timestampFormatted: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      }),
      // Section 1: Team & Communication
      brand: formatField(rawData.brand),
      contact: formatField(rawData.contact),
      email: formatField(rawData.email),
      phone: formatField(rawData.phone),
      approver: formatField(rawData.approver),
      channel: formatField(rawData.channel),
      tz: formatField(rawData.tz),
      emergency: formatField(rawData.emergency),

      // Section 2: Business & Product
      url: formatField(rawData.url),
      sell: formatField(rawData.sell),
      products: formatField(rawData.products),
      why: formatField(rawData.why),
      competitors: formatField(rawData.competitors),
      brandguide: formatField(rawData.brandguide),
      assets: formatField(rawData.assets),

      // Section 3: Financials & Numbers
      aov: formatField(rawData.aov),
      margin: formatField(rawData.margin),
      varcosts: formatField(rawData.varcosts),
      spend: formatField(rawData.spend),
      cac: formatField(rawData.cac),
      repeat: formatField(rawData.repeat),
      timebetween: formatField(rawData.timebetween),
      ltv: formatField(rawData.ltv),
      minprofit: formatField(rawData.minprofit),
      otherkpi: formatField(rawData.otherkpi),

      // Section 4: Current Marketing & Setup
      channels: formatField(rawData.channels),
      mediarun: formatField(rawData.mediarun),
      agencypast: formatField(rawData.agencypast),
      tools: formatField(rawData.tools),
      tracking: formatField(rawData.tracking),
      bestcampaign: formatField(rawData.bestcampaign),

      // Section 5: Creative & Content
      existingcreative: formatField(rawData.existingcreative),
      ugc: formatField(rawData.ugc),
      samples: formatField(rawData.samples),
      avoid: formatField(rawData.avoid),

      // Section 6: Retention
      esp: formatField(rawData.esp),
      flows: formatField(rawData.flows),

      // Section 7: Goals & Timing
      goal90: formatField(rawData.goal90),
      goal12: formatField(rawData.goal12),
      dates: formatField(rawData.dates),
      constraints: formatField(rawData.constraints),
      anything: formatField(rawData.anything),
    };

    console.log("=== NEW CLIENT ONBOARDING SUBMISSION ===");
    console.log(JSON.stringify(submission, null, 2));

    // Send to Google Sheets webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEETS_ONBOARDING_WEBHOOK_URL;
    let sheetSynced = false;

    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
        });

        if (response.ok) {
          sheetSynced = true;
          console.log("[Onboarding API] Successfully synced to Google Sheets webhook");
        } else {
          console.error(
            `[Onboarding API] Google Sheets webhook error: ${response.status} ${response.statusText}`
          );
        }
      } catch (webhookErr) {
        console.error("[Onboarding API] Webhook fetch failed:", webhookErr);
      }
    } else {
      console.log(
        "[Onboarding API] GOOGLE_SHEETS_ONBOARDING_WEBHOOK_URL not configured. Submission saved in server logs."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding data received successfully",
      sheetSynced,
      data: {
        brand: submission.brand,
        contact: submission.contact,
        email: submission.email,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error: any) {
    console.error("[Onboarding API] Error processing submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error while processing onboarding",
      },
      { status: 500 }
    );
  }
}
