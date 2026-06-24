"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsEditor from "@/components/admin/SettingsEditor";
import ListEditor from "@/components/admin/ListEditor";

const TABS = ["Settings", "Services", "Projects", "Stats", "Testimonials", "Process"] as const;
type Tab = (typeof TABS)[number];

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Settings");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">CMS panel</h1>
        <button onClick={logout} className="text-sm underline text-ink-light">
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 border-b border-ink/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-ink text-stone" : "bg-paper text-ink-light hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Settings" && <SettingsEditor />}

      {tab === "Services" && (
        <ListEditor
          endpoint="services"
          itemLabel={() => "service"}
          defaultItem={{ stage: "Stage", title: "New service", description: "Description", tags: [], proof_stat: "" }}
          fields={[
            { key: "stage", label: "Stage (e.g. Build)", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "proof_stat", label: "Proof stat (e.g. \"40+ sites shipped\")", type: "text" },
            { key: "tags", label: "Tools / tags", type: "tags" },
          ]}
        />
      )}

      {tab === "Projects" && (
        <ListEditor
          endpoint="projects"
          itemLabel={() => "project"}
          defaultItem={{
            title: "New project",
            summary: "Summary",
            category: "web",
            url: "",
            contact_name: "",
            contact_phone: "",
            problem: "",
            solution: "",
            result: "",
          }}
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "category", label: "Category", type: "select", options: ["web", "data", "writing"] },
            { key: "summary", label: "Summary", type: "textarea" },
            { key: "url", label: "URL", type: "text" },
            { key: "contact_name", label: "Referee name", type: "text" },
            { key: "contact_phone", label: "Referee phone", type: "text" },
            { key: "problem", label: "Problem", type: "textarea" },
            { key: "solution", label: "What I built", type: "textarea" },
            { key: "result", label: "Result", type: "textarea" },
          ]}
        />
      )}

      {tab === "Stats" && (
        <ListEditor
          endpoint="stats"
          itemLabel={() => "stat"}
          defaultItem={{ value: "[New]", label: "New stat" }}
          fields={[
            { key: "value", label: "Value (e.g. \"30+\")", type: "text" },
            { key: "label", label: "Label (e.g. \"Projects delivered\")", type: "text" },
          ]}
        />
      )}

      {tab === "Testimonials" && (
        <ListEditor
          endpoint="testimonials"
          itemLabel={() => "testimonial"}
          defaultItem={{ client_name: "Client name", client_context: "", quote: "" }}
          fields={[
            { key: "client_name", label: "Client name", type: "text" },
            { key: "client_context", label: "Context (e.g. \"Upwork \u2014 web development\")", type: "text" },
            { key: "quote", label: "Quote", type: "textarea" },
          ]}
        />
      )}

      {tab === "Process" && (
        <ListEditor
          endpoint="process"
          itemLabel={() => "step"}
          defaultItem={{ title: "New step", description: "Description" }}
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
        />
      )}
    </main>
  );
}
