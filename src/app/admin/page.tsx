"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const body = await res.json();
      setError(body.error || "Login failed.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-paper rounded-2xl p-8 w-full max-w-sm grid gap-4"
      >
        <h1 className="font-display text-2xl text-ink">Admin sign in</h1>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-xl border border-ink/20 px-4 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-ink text-stone px-6 py-3 font-medium disabled:opacity-60"
        >
          {loading ? "Checking…" : "Sign in"}
        </button>
        {error && <p className="text-rust text-sm">{error}</p>}
      </form>
    </main>
  );
}
