import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // 1. Save the lead so nothing is lost even if email delivery fails.
  try {
    const supabase = getAdminSupabase();
    await supabase.from("leads").insert({ name, email, message });
  } catch (err) {
    console.error("Failed to save lead:", err);
  }

  // 2. Email the owner via Resend.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json(
      { error: "Message saved, but the email notification failed to send." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
