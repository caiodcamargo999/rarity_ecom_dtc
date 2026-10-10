import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "VTurb Webhook receiver endpoint is active and listening.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    console.log("🎬 [VTurb Webhook Received]", rawBody);

    const {
      event = "vturb_webhook_event",
      video_id = "",
      email = "",
      phone = "",
      name = "",
      seconds_watched = 0,
      percentage_watched = 0,
      visitor_id = "",
      session_id = "",
      url = "",
    } = rawBody;

    if (isSupabaseConfigured && supabaseAdmin) {
      const nowIso = new Date().toISOString();

      // Insert event into analytics_events
      await supabaseAdmin.from("analytics_events").insert({
        session_id: session_id || "webhook",
        visitor_id: visitor_id || email || `vturb_${video_id}`,
        pathname: url || "/",
        event_type: "vturb_webhook",
        event_name: `VTurb: ${event} (${percentage_watched || seconds_watched}%)`,
        event_data: rawBody,
        created_at: nowIso,
      });

      // If lead email is provided, update or insert lead record
      if (email) {
        await supabaseAdmin.from("analytics_leads").insert({
          visitor_id: visitor_id || email,
          session_id: session_id || "vturb_webhook",
          full_name: name || null,
          email: email.toLowerCase().trim(),
          phone: phone || null,
          source: url || "VTurb Player",
          created_at: nowIso,
        });
      }
    }

    return NextResponse.json({ success: true, message: "VTurb event recorded" });
  } catch (err: any) {
    console.error("Error processing VTurb webhook:", err);
    return NextResponse.json({ success: false, error: err?.message || "Webhook error" }, { status: 500 });
  }
}
