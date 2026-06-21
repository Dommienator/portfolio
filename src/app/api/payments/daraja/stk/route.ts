import { NextRequest, NextResponse } from "next/server";
import { initiateStkPush, normalizeKenyanPhone } from "@/lib/daraja";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { phone, amount, description = "Payment" } = await req.json();

  if (!phone || !amount || isNaN(Number(amount))) {
    return NextResponse.json({ error: "A valid phone and amount are required." }, { status: 400 });
  }

  try {
    const result = await initiateStkPush(phone, Number(amount), description);

    const supabase = getAdminSupabase();
    await supabase.from("payments").insert({
      provider: "daraja",
      provider_ref: result.CheckoutRequestID,
      amount,
      currency: "KES",
      status: "pending",
      payer_phone: normalizeKenyanPhone(phone),
      description,
    });

    return NextResponse.json({
      ok: true,
      checkoutRequestId: result.CheckoutRequestID,
      message: "Check your phone and enter your M-Pesa PIN to complete payment.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not start M-Pesa payment." }, { status: 502 });
  }
}
