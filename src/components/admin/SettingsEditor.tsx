"use client";

import { useEffect, useState } from "react";

type Settings = {
  full_name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  about_text: string;
  availability_status: string;
  response_time: string;
  hours_per_week: string;
};

const FIELDS: { key: keyof Settings; label: string; textarea?: boolean }[] = [
  { key: "full_name", label: "Full name" },
  { key: "tagline", label: "Tagline (shown under your name in the hero)" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "availability_status", label: "Availability status (e.g. \"Available now\")" },
  { key: "response_time", label: "Typical response time" },
  { key: "hours_per_week", label: "Capacity (e.g. \"20+ hrs/week\")" },
  { key: "about_text", label: "Your \"why this combination\" story", textarea: true },
];

export default function SettingsEditor() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p className="text-ink-light text-sm">Loading…</p>;

  return (
    <div className="grid gap-3 max-w-2xl">
      {FIELDS.map((f) =>
        f.textarea ? (
          <div key={f.key}>
            <label className="font-mono-label text-xs uppercase text-teal block mb-1">
              {f.label}
            </label>
            <textarea
              value={settings[f.key]}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-ink/20 px-3 py-2"
            />
          </div>
        ) : (
          <div key={f.key}>
            <label className="font-mono-label text-xs uppercase text-teal block mb-1">
              {f.label}
            </label>
            <input
              value={settings[f.key]}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              className="w-full rounded-lg border border-ink/20 px-3 py-2"
            />
          </div>
        )
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-teal text-white px-6 py-3 text-sm font-medium disabled:opacity-60 w-fit"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && <span className="text-teal text-sm">Saved.</span>}
      </div>
    </div>
  );
}
