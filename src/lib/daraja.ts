const DARAJA_BASE =
  process.env.DARAJA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    throw new Error(`Daraja auth failed: ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

// Normalizes 07XXXXXXXX / +254XXXXXXXXX / 254XXXXXXXXX to 254XXXXXXXXX
export function normalizeKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

export async function initiateStkPush(phone: string, amount: number, description: string) {
  const token = await getAccessToken();
  const ts = timestamp();
  const shortcode = process.env.DARAJA_SHORTCODE!;
  const passkey = process.env.DARAJA_PASSKEY!;
  const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");
  const phoneFormatted = normalizeKenyanPhone(phone);

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phoneFormatted,
      PartyB: shortcode,
      PhoneNumber: phoneFormatted,
      CallBackURL: process.env.DARAJA_CALLBACK_URL,
      AccountReference: "Portfolio Payment",
      TransactionDesc: description.slice(0, 13) || "Payment",
    }),
  });

  if (!res.ok) {
    throw new Error(`Daraja STK push failed: ${await res.text()}`);
  }
  return res.json();
}
