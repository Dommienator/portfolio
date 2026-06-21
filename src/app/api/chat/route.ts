import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the assistant on a freelance professional's portfolio site.
They offer four connected capabilities: web development, data analysis, content
writing (SEO, technical, and academic), and payment/systems integration
(M-Pesa Daraja, PayPal, and similar gateways). Frame these as one connected
practice, not unrelated side gigs: a site gets built, its data gets read, its
story gets told, its payments get collected.

Answer visitor questions about these services, give rough guidance on how the
person works, and encourage visitors with real projects to use the contact
form. Do not invent specific prices, deadlines, or guarantees on the person's
behalf — suggest they ask via the contact form for a quote. Keep answers short
and conversational.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content
      ?.filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    return NextResponse.json({ text: text || "Sorry, I didn't catch that." });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 502 });
  }
}
