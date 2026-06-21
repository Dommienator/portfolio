import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

// Safaricom calls this URL directly after the customer completes (or cancels)
// the STK push prompt. It must be a public HTTPS URL — set DARAJA_CALLBACK_URL
// to https://your-domain/api/payments/daraja/callback after deploying.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const callback = body?.Body?.stkCallback;

  if (!callback) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const checkoutRequestId = callback.CheckoutRequestID;
  const success = callback.ResultCode === 0;

  try {
    const supabase = getAdminSupabase();
    await supabase
      .from("payments")
      .update({
        status: success ? "completed" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("provider_ref", checkoutRequestId);
  } catch (err) {
    console.error("Failed to update payment from Daraja callback:", err);
  }

  // Safaricom expects this exact acknowledgement shape.
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
