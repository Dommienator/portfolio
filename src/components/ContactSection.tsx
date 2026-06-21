"use client";

import { useState } from "react";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono-label text-xs uppercase text-teal mb-2">Get in touch</p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink mb-8">
        Tell me what you&#x2019;re building.
      </h2>

      {status === "sent" ? (
        <p className="rounded-2xl bg-teal/10 text-teal p-6 max-w-xl">
          Thanks — your message is in. I reply within a day, usually sooner.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl grid gap-4">
          <input
            name="name"
            required
            placeholder="Your name"
            className="rounded-xl border border-ink/20 px-4 py-3 bg-white/60 focus:border-teal"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Your email"
            className="rounded-xl border border-ink/20 px-4 py-3 bg-white/60 focus:border-teal"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="What do you need built, analyzed, written, or wired up?"
            className="rounded-xl border border-ink/20 px-4 py-3 bg-white/60 focus:border-teal"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-ink px-6 py-3 text-stone font-medium hover:bg-ink-light transition-colors disabled:opacity-60 w-fit"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "error" && <p className="text-rust text-sm">{errorMsg}</p>}
        </form>
      )}
    </section>
  );
}
