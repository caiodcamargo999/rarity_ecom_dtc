const QUO_API_KEY =
  process.env.QUO_API_KEY ||
  "518659b06aa369d73f592a77aa0e50cac29a5900119d69561b07bac762d6a066";

export interface QuoLeadData {
  fullName?: string;
  email?: string;
  phone?: string;
  brandOrStore?: string;
  company?: string;
  monthlyRevenue?: string;
  monthlyAdSpend?: string;
  bottleneck?: string;
  role?: string;
  meetingDate?: string;
  scheduledOnCal?: string;
  utms?: Record<string, any>;
  source?: string;
  sourceUrl?: string;
}

export async function syncLeadToQuoCrm(lead: QuoLeadData) {
  if (!QUO_API_KEY) {
    console.warn("QUO_API_KEY not configured. Skipping Quo CRM sync.");
    return null;
  }

  const email = (lead.email || "").trim().toLowerCase();
  const phone = (lead.phone || "").trim();
  const rawName = (lead.fullName || "").trim() || "Growth Audit Lead";
  const nameParts = rawName.split(" ");
  const firstName = nameParts[0] || "Growth";
  const lastName = nameParts.slice(1).join(" ") || "";

  const company =
    lead.brandOrStore ||
    lead.company ||
    "Ecom Brand";

  // Build clean Role string
  const roleParts: string[] = [];
  if (lead.role) roleParts.push(lead.role);
  if (lead.monthlyRevenue) roleParts.push(`Rev: ${lead.monthlyRevenue}`);
  if (lead.monthlyAdSpend) roleParts.push(`Spend: ${lead.monthlyAdSpend}`);
  if (lead.meetingDate) roleParts.push(`Call: ${lead.meetingDate}`);

  const roleSummary = roleParts.join(" • ") || "Growth Audit Lead";

  // Known Quo Custom Fields mapping
  const customPropertyKeyMap: Record<string, string> = {
    revenue: "6aa567aea21ae4b5e1663735",
    spend: "6aa568faa21ae4b5e166373b",
    bottleneck: "6aa56931a21ae4b5e1663741",
    decision: "6aa56946a21ae4b5e1663747",
    start: "6aa56a24a21ae4b5e166374d",
    call: "6aad5cc05e0e871610623e51",
    utm_source: "",
    utm_campaign: "",
    utm_medium: "",
    utm_content: "",
    utm_term: "",
    fbclid: "",
  };

  try {
    const cfResponse = await fetch("https://api.openphone.com/v1/contact-custom-fields", {
      headers: { Authorization: QUO_API_KEY },
    });
    if (cfResponse.ok) {
      const cfData = await cfResponse.json();
      const fields = cfData?.data || [];
      for (const f of fields) {
        const nameLower = (f.name || "").toLowerCase().trim();
        if (nameLower.includes("revenue") || nameLower.includes("faturamento")) {
          customPropertyKeyMap.revenue = f.key;
        } else if (nameLower.includes("spend") || nameLower.includes("ad spend")) {
          customPropertyKeyMap.spend = f.key;
        } else if (
          nameLower.includes("bottleneck") ||
          nameLower.includes("scalling") ||
          nameLower.includes("scaling")
        ) {
          customPropertyKeyMap.bottleneck = f.key;
        } else if (nameLower.includes("decision") || nameLower.includes("founder")) {
          customPropertyKeyMap.decision = f.key;
        } else if (nameLower.includes("ready") || nameLower.includes("start")) {
          customPropertyKeyMap.start = f.key;
        } else if (nameLower.includes("call") || nameLower.includes("date") || nameLower.includes("time")) {
          customPropertyKeyMap.call = f.key;
        } else if (nameLower === "utm source" || nameLower === "utm_source" || nameLower === "ad source") {
          customPropertyKeyMap.utm_source = f.key;
        } else if (
          nameLower === "utm campaign" ||
          nameLower === "utm_campaign" ||
          nameLower === "campaign" ||
          nameLower === "ad campaign"
        ) {
          customPropertyKeyMap.utm_campaign = f.key;
        } else if (nameLower === "utm medium" || nameLower === "utm_medium" || nameLower === "medium") {
          customPropertyKeyMap.utm_medium = f.key;
        } else if (
          nameLower === "utm content" ||
          nameLower === "utm_content" ||
          nameLower === "ad content" ||
          nameLower === "ad name" ||
          nameLower === "creative"
        ) {
          customPropertyKeyMap.utm_content = f.key;
        } else if (
          nameLower === "utm term" ||
          nameLower === "utm_term" ||
          nameLower === "ad set" ||
          nameLower === "audience"
        ) {
          customPropertyKeyMap.utm_term = f.key;
        } else if (nameLower === "fbclid" || nameLower === "fb click id" || nameLower === "meta click id") {
          customPropertyKeyMap.fbclid = f.key;
        }
      }
    }
  } catch (e) {
    console.warn("Could not fetch custom fields schema dynamically, using fallback keys", e);
  }

  const customFieldsPayload: { key: string; value: string }[] = [];
  if (lead.monthlyRevenue && customPropertyKeyMap.revenue) {
    customFieldsPayload.push({ key: customPropertyKeyMap.revenue, value: lead.monthlyRevenue });
  }
  if (lead.monthlyAdSpend && customPropertyKeyMap.spend) {
    customFieldsPayload.push({ key: customPropertyKeyMap.spend, value: lead.monthlyAdSpend });
  }
  if (lead.bottleneck && customPropertyKeyMap.bottleneck) {
    customFieldsPayload.push({ key: customPropertyKeyMap.bottleneck, value: lead.bottleneck });
  }
  if (lead.role && customPropertyKeyMap.decision) {
    customFieldsPayload.push({ key: customPropertyKeyMap.decision, value: lead.role });
  }
  if (lead.meetingDate && customPropertyKeyMap.call) {
    customFieldsPayload.push({
      key: customPropertyKeyMap.call,
      value: lead.meetingDate,
    });
  }

  const utms = lead.utms || {};
  if (utms.utm_source && customPropertyKeyMap.utm_source) {
    customFieldsPayload.push({ key: customPropertyKeyMap.utm_source, value: utms.utm_source });
  }
  if (utms.utm_campaign && customPropertyKeyMap.utm_campaign) {
    customFieldsPayload.push({ key: customPropertyKeyMap.utm_campaign, value: utms.utm_campaign });
  }
  if (utms.utm_medium && customPropertyKeyMap.utm_medium) {
    customFieldsPayload.push({ key: customPropertyKeyMap.utm_medium, value: utms.utm_medium });
  }
  if (utms.utm_content && customPropertyKeyMap.utm_content) {
    customFieldsPayload.push({ key: customPropertyKeyMap.utm_content, value: utms.utm_content });
  }
  if (utms.utm_term && customPropertyKeyMap.utm_term) {
    customFieldsPayload.push({ key: customPropertyKeyMap.utm_term, value: utms.utm_term });
  }
  if (utms.fbclid && customPropertyKeyMap.fbclid) {
    customFieldsPayload.push({ key: customPropertyKeyMap.fbclid, value: utms.fbclid });
  }

  const emailsList = email ? [{ name: "work", value: email }] : [];
  const phonesList = phone ? [{ name: "work", value: phone }] : [];

  const quoPayload: Record<string, any> = {
    source: lead.source || "Growth Diagnostic Website",
    sourceUrl: lead.sourceUrl || "https://rarityagency.com",
    defaultFields: {
      firstName,
      lastName,
      company,
      role: roleSummary,
      emails: emailsList,
      phoneNumbers: phonesList,
    },
    customFields: customFieldsPayload,
  };

  try {
    const quoResponse = await fetch("https://api.openphone.com/v1/contacts", {
      method: "POST",
      headers: {
        Authorization: QUO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoPayload),
    });
    const quoResult = await quoResponse.json();
    console.log("✅ [Quo CRM] Contact synced successfully with custom fields:", quoResult?.data?.id);
    return quoResult;
  } catch (err) {
    console.error("Error syncing contact in Quo:", err);
    return null;
  }
}
