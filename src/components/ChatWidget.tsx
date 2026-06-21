"use client";

import { useState, useRef, useEffect } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — ask me anything about web development, data analysis, content writing, or payment integrations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text || data.error }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, something went wrong. Please try the contact form." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden">
          <div className="bg-ink text-stone px-4 py-3 flex items-center justify-between">
            <span className="font-mono-label text-xs uppercase">Ask the assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-marigold/20 rounded-xl px-3 py-2"
                    : "mr-auto max-w-[85%] bg-stone rounded-xl px-3 py-2"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="mr-auto text-ink-light text-xs">Thinking…</div>}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t border-ink/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a question…"
              className="flex-1 rounded-full border border-ink/20 px-3 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="rounded-full bg-ink text-stone px-4 py-2 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-marigold text-ink w-14 h-14 shadow-xl text-xl font-display"
        aria-label="Open chat assistant"
      >
        {open ? "✕" : "?"}
      </button>
    </div>
  );
}
