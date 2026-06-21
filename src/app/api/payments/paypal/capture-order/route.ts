import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { orderID } = await req.json();
  if (!orderID) {
    return NextResponse.json({ error: "orderID is required." }, { status: 400 });
  }

  try {
    const result = await captureOrder(orderID);
    const status = result.status === "COMPLETED" ? "completed" : "failed";
    const payerEmail = result.payer?.email_address;

    const supabase = getAdminSupabase();
    await supabase
      .from("payments")
      .update({ status, payer_email: payerEmail, updated_at: new Date().toISOString() })
      .eq("provider_ref", orderID);

    return NextResponse.json({ status, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not capture PayPal payment." }, { status: 502 });
  }
}
