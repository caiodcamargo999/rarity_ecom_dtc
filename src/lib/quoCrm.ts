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
  timeZone?: string;
}

// Normalize phone to clean digits for robust matching
function cleanPhoneDigits(phone?: string): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

// Format meeting date cleanly into DD/MM/YYYY, HH:mm if given as ISO timestamp
export function formatMeetingDate(dateStr?: string, timeZone?: string): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  // Already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
    return trimmed;
  }
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString("pt-BR", {
        timeZone: timeZone || "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (e) {
    // Return original string if parse fails
  }
  return trimmed;
}

// Find existing contact by email (case-insensitive) or phone number in Quo CRM
async function findExistingQuoContact(email?: string, phone?: string) {
  if (!QUO_API_KEY) return null;

  const cleanEmail = (email || "").trim().toLowerCase();
  const phoneDigits = cleanPhoneDigits(phone);

  if (!cleanEmail && !phoneDigits) return null;

  try {
    const res = await fetch("https://api.openphone.com/v1/contacts?maxResults=100", {
      headers: { Authorization: QUO_API_KEY },
    });

    if (!res.ok) {
      console.warn(`[Quo CRM] Failed to search contacts: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    const contacts: any[] = data?.data || [];

    // 1. Try matching by exact email
    if (cleanEmail) {
      const matchByEmail = contacts.find((c) =>
        c.defaultFields?.emails?.some(
          (e: any) => (e.value || "").trim().toLowerCase() === cleanEmail
        )
      );
      if (matchByEmail) return matchByEmail;
    }

    // 2. Try matching by phone (last 9 digits or exact digit match)
    if (phoneDigits && phoneDigits.length >= 7) {
      const targetSuffix = phoneDigits.slice(-9);
      const matchByPhone = contacts.find((c) =>
        c.defaultFields?.phoneNumbers?.some((p: any) => {
          const cDigits = cleanPhoneDigits(p.value);
          return (
            cDigits === phoneDigits ||
            (cDigits.length >= 7 && (cDigits.endsWith(targetSuffix) || phoneDigits.endsWith(cDigits.slice(-9))))
          );
        })
      );
      if (matchByPhone) return matchByPhone;
    }

    return null;
  } catch (err) {
    console.error("[Quo CRM] Error searching existing contact:", err);
    return null;
  }
}

export async function syncLeadToQuoCrm(lead: QuoLeadData) {
  if (!QUO_API_KEY) {
    console.warn("QUO_API_KEY not configured. Skipping Quo CRM sync.");
    return null;
  }

  const email = (lead.email || "").trim().toLowerCase();
  const phone = (lead.phone || "").trim();
  const formattedDate = formatMeetingDate(lead.meetingDate, lead.timeZone);

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

  // 1. Check if contact already exists in Quo
  const existingContact = await findExistingQuoContact(email, phone);

  if (existingContact) {
    console.log(`🔄 [Quo CRM] Found existing contact (${existingContact.id}) for ${email || phone}. Updating in-place...`);

    const existingDefault = existingContact.defaultFields || {};
    const existingCustomFields = existingContact.customFields || [];

    // Map existing custom field key -> value
    const customMap = new Map<string, string>();
    for (const cf of existingCustomFields) {
      if (cf.key && cf.value) {
        customMap.set(cf.key, String(cf.value));
      }
    }

    // Merge new custom fields if provided
    if (lead.monthlyRevenue && customPropertyKeyMap.revenue) {
      customMap.set(customPropertyKeyMap.revenue, lead.monthlyRevenue);
    }
    if (lead.monthlyAdSpend && customPropertyKeyMap.spend) {
      customMap.set(customPropertyKeyMap.spend, lead.monthlyAdSpend);
    }
    if (lead.bottleneck && customPropertyKeyMap.bottleneck) {
      customMap.set(customPropertyKeyMap.bottleneck, lead.bottleneck);
    }
    if (lead.role && customPropertyKeyMap.decision) {
      customMap.set(customPropertyKeyMap.decision, lead.role);
    }
    if (formattedDate && customPropertyKeyMap.call) {
      customMap.set(customPropertyKeyMap.call, formattedDate);
    }

    const utms = lead.utms || {};
    if (utms.utm_source && customPropertyKeyMap.utm_source) customMap.set(customPropertyKeyMap.utm_source, utms.utm_source);
    if (utms.utm_campaign && customPropertyKeyMap.utm_campaign) customMap.set(customPropertyKeyMap.utm_campaign, utms.utm_campaign);
    if (utms.utm_medium && customPropertyKeyMap.utm_medium) customMap.set(customPropertyKeyMap.utm_medium, utms.utm_medium);
    if (utms.utm_content && customPropertyKeyMap.utm_content) customMap.set(customPropertyKeyMap.utm_content, utms.utm_content);
    if (utms.utm_term && customPropertyKeyMap.utm_term) customMap.set(customPropertyKeyMap.utm_term, utms.utm_term);
    if (utms.fbclid && customPropertyKeyMap.fbclid) customMap.set(customPropertyKeyMap.fbclid, utms.fbclid);

    // Merge names: prefer fuller/longer name
    let firstName = existingDefault.firstName || "";
    let lastName = existingDefault.lastName || "";
    if (lead.fullName && lead.fullName.trim() !== "Growth Audit Lead") {
      const parts = lead.fullName.trim().split(" ");
      if (parts[0]) firstName = parts[0];
      if (parts.length > 1) lastName = parts.slice(1).join(" ");
    }

    // Merge company: don't overwrite real company with default "Ecom Brand"
    let company = existingDefault.company || "";
    const newCompany = lead.brandOrStore || lead.company;
    if (newCompany && newCompany !== "Ecom Brand") {
      company = newCompany;
    } else if (!company) {
      company = "Ecom Brand";
    }

    // Merge phone: prefer provided phone if valid or keep existing
    let phonesList = existingDefault.phoneNumbers || [];
    if (phone) {
      phonesList = [{ name: "work", value: phone }];
    }

    // Merge email
    let emailsList = existingDefault.emails || [];
    if (email) {
      emailsList = [{ name: "work", value: email }];
    }

    // Build unified updated Role string
    const roleParts: string[] = [];
    const activeRole = lead.role || customMap.get(customPropertyKeyMap.decision) || existingDefault.role?.split(" • ")[0] || "Founder / CEO / Co-Founder";
    if (activeRole && !activeRole.includes("Rev:") && !activeRole.includes("Call:")) {
      roleParts.push(activeRole);
    }
    const activeRevenue = lead.monthlyRevenue || customMap.get(customPropertyKeyMap.revenue);
    if (activeRevenue) roleParts.push(`Rev: ${activeRevenue}`);

    const activeSpend = lead.monthlyAdSpend || customMap.get(customPropertyKeyMap.spend);
    if (activeSpend) roleParts.push(`Spend: ${activeSpend}`);

    const activeDate = formattedDate || customMap.get(customPropertyKeyMap.call);
    if (activeDate) roleParts.push(`Call: ${activeDate}`);

    const roleSummary = roleParts.join(" • ") || existingDefault.role || "Growth Audit Lead";

    const customFieldsPayload = Array.from(customMap.entries()).map(([key, value]) => ({
      key,
      value,
    }));

    const patchPayload = {
      defaultFields: {
        firstName: firstName || "Growth",
        lastName: lastName || "",
        company,
        role: roleSummary,
        emails: emailsList,
        phoneNumbers: phonesList,
      },
      customFields: customFieldsPayload,
    };

    try {
      const patchRes = await fetch(`https://api.openphone.com/v1/contacts/${existingContact.id}`, {
        method: "PATCH",
        headers: {
          Authorization: QUO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchPayload),
      });

      const patchResult = await patchRes.json();
      console.log("✅ [Quo CRM] Existing contact successfully updated with date & time:", existingContact.id);
      return patchResult;
    } catch (patchErr) {
      console.error("[Quo CRM] Error updating existing contact in Quo:", patchErr);
      return null;
    }
  }

  // 2. No existing contact found -> Create new contact via POST
  console.log(`➕ [Quo CRM] No existing contact found for ${email || phone}. Creating new contact...`);

  const rawName = (lead.fullName || "").trim() || "Growth Audit Lead";
  const nameParts = rawName.split(" ");
  const firstName = nameParts[0] || "Growth";
  const lastName = nameParts.slice(1).join(" ") || "";

  const company = lead.brandOrStore || lead.company || "Ecom Brand";

  // Build clean Role string
  const roleParts: string[] = [];
  if (lead.role) roleParts.push(lead.role);
  if (lead.monthlyRevenue) roleParts.push(`Rev: ${lead.monthlyRevenue}`);
  if (lead.monthlyAdSpend) roleParts.push(`Spend: ${lead.monthlyAdSpend}`);
  if (formattedDate) roleParts.push(`Call: ${formattedDate}`);

  const roleSummary = roleParts.join(" • ") || "Growth Audit Lead";

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
  if (formattedDate && customPropertyKeyMap.call) {
    customFieldsPayload.push({
      key: customPropertyKeyMap.call,
      value: formattedDate,
    });
  }

  const utms = lead.utms || {};
  if (utms.utm_source && customPropertyKeyMap.utm_source) customFieldsPayload.push({ key: customPropertyKeyMap.utm_source, value: utms.utm_source });
  if (utms.utm_campaign && customPropertyKeyMap.utm_campaign) customFieldsPayload.push({ key: customPropertyKeyMap.utm_campaign, value: utms.utm_campaign });
  if (utms.utm_medium && customPropertyKeyMap.utm_medium) customFieldsPayload.push({ key: customPropertyKeyMap.utm_medium, value: utms.utm_medium });
  if (utms.utm_content && customPropertyKeyMap.utm_content) customFieldsPayload.push({ key: customPropertyKeyMap.utm_content, value: utms.utm_content });
  if (utms.utm_term && customPropertyKeyMap.utm_term) customFieldsPayload.push({ key: customPropertyKeyMap.utm_term, value: utms.utm_term });
  if (utms.fbclid && customPropertyKeyMap.fbclid) customFieldsPayload.push({ key: customPropertyKeyMap.fbclid, value: utms.fbclid });

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
    console.log("✅ [Quo CRM] Contact created successfully:", quoResult?.data?.id);
    return quoResult;
  } catch (err) {
    console.error("Error creating contact in Quo:", err);
    return null;
  }
}
