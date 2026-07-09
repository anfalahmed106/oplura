import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Where lead notifications get sent — change this to your inbox.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "you@oplura.co";
// Must be an address on your verified Resend domain (e.g. oplura.co).
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "leads@oplura.co";

type ContactPayload = {
  fullName?: string;
  businessEmail?: string;
  phoneNumber?: string;
  companyName?: string;
  industry?: string;
  automate?: string;
  companySize?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const businessEmail = (body.businessEmail ?? "").trim();
  const phoneNumber = (body.phoneNumber ?? "").trim();
  const companyName = (body.companyName ?? "").trim();
  const industry = (body.industry ?? "").trim();
  const automate = (body.automate ?? "").trim();
  const companySize = (body.companySize ?? "").trim();

  // Server-side validation — never trust the client alone.
  if (!fullName || !businessEmail || !phoneNumber || !industry) {
    return NextResponse.json(
      { error: "Full name, business email, phone number, and industry are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(businessEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  const rows: [string, string][] = [
    ["Full Name", fullName],
    ["Business Email", businessEmail],
    ["Phone Number", phoneNumber],
    ["Company Name", companyName || "—"],
    ["Industry / Business Type", industry],
    ["Looking For", automate || "—"],
    ["Estimated Company Size", companySize || "—"],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#111;border-bottom:1px solid #eee;">${escapeHtml(
          label
        )}</td><td style="padding:6px 12px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#111;">New lead from oplura.co</h2>
      <table style="width:100%;border-collapse:collapse;">${htmlRows}</table>
    </div>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  try {
    const { error } = await resend.emails.send({
      from: `Oplura Website <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: businessEmail,
      subject: `New lead: ${fullName}${companyName ? ` (${companyName})` : ""}`,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
