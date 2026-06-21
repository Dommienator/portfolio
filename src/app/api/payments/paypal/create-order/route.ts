import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { amount, currency = "USD", description = "Payment" } = await req.json();

  if (!amount || isNaN(Number(amount))) {
    return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
  }

  try {
    const order = await createOrder(String(amount), currency, description);

    const supabase = getAdminSupabase();
    await supabase.from("payments").insert({
      provider: "paypal",
      provider_ref: order.id,
      amount,
      currency,
      status: "pending",
      description,
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not start PayPal payment." }, { status: 502 });
  }
}
