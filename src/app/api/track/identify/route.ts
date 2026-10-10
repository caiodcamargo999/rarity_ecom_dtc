import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitorId,
      sessionId,
      pathname = "/",
      email = "",
      phone = "",
      fullName = "",
      brandOrStore = "",
      monthlyRevenue = "",
      monthlyAdSpend = "",
      bottleneck = "",
      role = "",
      scheduledOnCal = "No",
      meetingDate = "",
      utms = {},
      customData = {},
    } = body;

    if (!visitorId) {
      return NextResponse.json({ success: false, error: "Missing visitorId" }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      console.log(`[Lead Identified (No DB)] Visitor: ${visitorId} | Email: ${email} | Name: ${fullName}`);
      return NextResponse.json({ success: true, warning: "Supabase not configured in env" });
    }

    const nowIso = new Date().toISOString();

    // 1. Update Visitor Profile
    await supabaseAdmin
      .from("analytics_visitors")
      .update({
        email: email || null,
        phone: phone || null,
        full_name: fullName || null,
        company_name: brandOrStore || null,
        last_seen_at: nowIso,
      })
      .eq("visitor_id", visitorId);

    // 2. Insert or update in analytics_leads
    await supabaseAdmin.from("analytics_leads").insert({
      visitor_id: visitorId,
      session_id: sessionId,
      full_name: fullName,
      email,
      phone,
      brand_or_store: brandOrStore,
      monthly_revenue: monthlyRevenue,
      monthly_ad_spend: monthlyAdSpend,
      bottleneck,
      role,
      scheduled_on_cal: scheduledOnCal,
      meeting_date: meetingDate,
      source: pathname || "Landing Page",
      utm_source: utms?.utm_source || null,
      utm_medium: utms?.utm_medium || null,
      utm_campaign: utms?.utm_campaign || null,
      created_at: nowIso,
    });

    // 3. Insert Lead Event in timeline
    await supabaseAdmin.from("analytics_events").insert({
      session_id: sessionId || "unknown",
      visitor_id: visitorId,
      pathname: pathname || "/",
      event_type: "lead_captured",
      event_name: `Lead Identified: ${fullName || email || "Anonymous Lead"}`,
      event_data: {
        email,
        phone,
        fullName,
        brandOrStore,
        monthlyRevenue,
        monthlyAdSpend,
        bottleneck,
        role,
        scheduledOnCal,
        meetingDate,
        customData,
      },
      created_at: nowIso,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Lead identification ingestion error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}
