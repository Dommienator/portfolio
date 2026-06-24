"use client";

import { useEffect, useState } from "react";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "tags" | "select";
  options?: string[];
  half?: boolean; // render at half-width, paired with the next field
};

type Item = Record<string, any>;

export default function ListEditor({
  endpoint,
  fields,
  defaultItem,
  itemLabel,
}: {
  endpoint: string; // e.g. "stats" -> hits /api/admin/stats
  fields: FieldConfig[];
  defaultItem: Item;
  itemLabel: (item: Item) => string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/${endpoint}`);
    const data = await res.json();
    setItems(data.items || data.services || data.projects || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(index: number, key: string, value: any) {
    const copy = [...items];
    copy[index] = { ...copy[index], [key]: value };
    setItems(copy);
  }

  async function save(item: Item) {
    setSavingId(item.id);
    await fetch(`/api/admin/${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setSavingId(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function add() {
    await fetch(`/api/admin/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...defaultItem, sort_order: items.length + 1 }),
    });
    load();
  }

  if (loading) return <p className="text-ink-light text-sm">Loading…</p>;

  return (
    <div className="grid gap-4">
      {items.map((item, i) => (
        <div key={item.id} className="border border-ink/10 rounded-xl p-4 bg-paper grid gap-2">
          <div className="grid sm:grid-cols-2 gap-2">
            {fields.map((field) => {
              const value = item[field.key] ?? "";
              if (field.type === "textarea") {
                return (
                  <textarea
                    key={field.key}
                    value={value}
                    onChange={(e) => updateField(i, field.key, e.target.value)}
                    placeholder={field.label}
                    rows={2}
                    className="sm:col-span-2 rounded-lg border border-ink/20 px-3 py-2"
                  />
                );
              }
              if (field.type === "tags") {
                return (
                  <input
                    key={field.key}
                    value={Array.isArray(value) ? value.join(", ") : value}
                    onChange={(e) =>
                      updateField(
                        i,
                        field.key,
                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      )
                    }
                    placeholder={`${field.label} (comma separated)`}
                    className="rounded-lg border border-ink/20 px-3 py-2"
                  />
                );
              }
              if (field.type === "select") {
                return (
                  <select
                    key={field.key}
                    value={value}
                    onChange={(e) => updateField(i, field.key, e.target.value)}
                    className="rounded-lg border border-ink/20 px-3 py-2"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                );
              }
              return (
                <input
                  key={field.key}
                  value={value}
                  onChange={(e) => updateField(i, field.key, e.target.value)}
                  placeholder={field.label}
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => save(items[i])}
              disabled={savingId === item.id}
              className="rounded-full bg-teal text-white px-4 py-2 text-sm disabled:opacity-60"
            >
              {savingId === item.id ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => remove(item.id)}
              className="rounded-full border border-rust text-rust px-4 py-2 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button onClick={add} className="rounded-full bg-ink text-stone px-4 py-2 text-sm w-fit">
        + Add {itemLabel(defaultItem)}
      </button>
    </div>
  );
}
