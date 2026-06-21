"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";

declare global {
  interface Window {
    paypal?: any;
  }
}

function DarajaForm() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/payments/daraja/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount, description: "Invoice payment" }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setStatus("sent");
      setMsg(body.message);
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-sm">
      <input
        required
        placeholder="M-Pesa phone (07XXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-xl border border-ink/20 px-4 py-3"
      />
      <input
        required
        type="number"
        min="1"
        placeholder="Amount (KES)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-xl border border-ink/20 px-4 py-3"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-teal text-white px-6 py-3 font-medium disabled:opacity-60 w-fit"
      >
        {status === "sending" ? "Sending prompt…" : "Pay with M-Pesa"}
      </button>
      {msg && (
        <p className={status === "error" ? "text-rust text-sm" : "text-teal text-sm"}>{msg}</p>
      )}
    </form>
  );
}

function PayPalButtons({ amount }: { amount: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.paypal) return;
    containerRef.current.innerHTML = "";
    window.paypal
      .Buttons({
        createOrder: async () => {
          const res = await fetch("/api/payments/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency: "USD", description: "Invoice payment" }),
          });
          const data = await res.json();
          return data.id;
        },
        onApprove: async (data: { orderID: string }) => {
          await fetch("/api/payments/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          alert("Payment complete — thank you!");
        },
      })
      .render(containerRef.current);
  }, [sdkReady, amount]);

  return <div ref={containerRef} className="max-w-sm" />;
}

export default function PayPage() {
  const [usdAmount, setUsdAmount] = useState("50");

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl text-ink mb-2">Pay an invoice</h1>
        <p className="text-ink-light mb-12">
          Choose whichever option is easiest on your end. Both go straight through —
          no middleman, no delay.
        </p>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-4">M-Pesa (Kenya)</h2>
          <DarajaForm />
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-4">PayPal (international)</h2>
          <div className="mb-4 max-w-xs">
            <label className="font-mono-label text-xs uppercase text-teal block mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="rounded-xl border border-ink/20 px-4 py-3 w-full"
            />
          </div>
          <PayPalButtons amount={usdAmount} />
        </section>
      </main>
    </>
  );
}
