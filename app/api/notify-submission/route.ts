import { NextResponse } from "next/server";

// Called by a Postgres trigger (pg_net, async) on every new row in
// church_suggestions — see the "add_church_suggestion_email_notification"
// migration. Sends one email via Resend so a submission doesn't sit unseen
// until someone happens to open the Supabase dashboard. The webhook secret
// (matched below) is the one the trigger sends; it authenticates the
// request as coming from this project's own database, not a random POST.
export const dynamic = "force-dynamic";

const FIELD_LABELS: Record<string, string> = {
  church_name: "Church name",
  address: "Address",
  locality: "City",
  region: "State",
  zip: "Zip",
  denomination: "Denomination",
  translation: "Translation",
  website: "Website",
  note: "Note",
  church_id: "Existing church ID",
};

const TYPE_LABELS: Record<string, string> = {
  edit: "Correction to an existing church",
  new_church: "New church suggested",
  closed: "Church reported as closed",
  site_correction: "Site correction",
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.SUBMISSION_WEBHOOK_SECRET || secret !== process.env.SUBMISSION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  const row = payload as Record<string, unknown>;
  const suggestionType = String(row.suggestion_type ?? "unknown");
  const typeLabel = TYPE_LABELS[suggestionType] ?? suggestionType;

  const lines = Object.entries(FIELD_LABELS)
    .filter(([key]) => row[key] !== null && row[key] !== undefined && row[key] !== "")
    .map(([key, label]) => `${label}: ${row[key]}`);

  const bodyText = [
    `New submission: ${typeLabel}`,
    "",
    ...lines,
    "",
    "Review it in the Supabase dashboard (church_suggestions table, status = pending).",
  ].join("\n");

  if (!process.env.RESEND_API_KEY) {
    // No key configured yet — don't fail the webhook, just skip sending.
    console.warn("notify-submission: RESEND_API_KEY not set, skipping email send.");
    return NextResponse.json({ ok: true, skipped: "no RESEND_API_KEY" });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's shared sandbox sender — works with no domain verification.
      // Swap for a verified address on your own domain once you have one.
      from: "BibleTranslationGuide <onboarding@resend.dev>",
      to: "tonynelson33@gmail.com",
      subject: `New Church Finder submission — ${typeLabel}`,
      text: bodyText,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("notify-submission: Resend send failed", res.status, detail);
    return NextResponse.json({ error: "Email send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
