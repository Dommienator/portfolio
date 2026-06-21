"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  sort_order: number;
  stage: string;
  title: string;
  description: string;
  tags: string[];
};

type Project = {
  id: string;
  sort_order: number;
  title: string;
  summary: string;
  url: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  category: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [sRes, pRes] = await Promise.all([
      fetch("/api/admin/services"),
      fetch("/api/admin/projects"),
    ]);
    const sData = await sRes.json();
    const pData = await pRes.json();
    setServices(sData.services || []);
    setProjects(pData.projects || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function saveService(s: Service) {
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    loadAll();
  }

  async function deleteService(id: string) {
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadAll();
  }

  async function addService() {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sort_order: services.length + 1,
        stage: "Stage",
        title: "New service",
        description: "Description",
        tags: [],
      }),
    });
    loadAll();
  }

  async function saveProject(p: Project) {
    await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    loadAll();
  }

  async function deleteProject(id: string) {
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadAll();
  }

  async function addProject() {
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sort_order: projects.length + 1,
        title: "New project",
        summary: "Summary",
        category: "web",
      }),
    });
    loadAll();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  if (loading) return <main className="p-10">Loading…</main>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl text-ink">CMS panel</h1>
        <button onClick={logout} className="text-sm underline text-ink-light">
          Sign out
        </button>
      </div>

      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-ink">Services</h2>
          <button
            onClick={addService}
            className="rounded-full bg-ink text-stone px-4 py-2 text-sm"
          >
            + Add service
          </button>
        </div>
        <div className="grid gap-4">
          {services.map((s, i) => (
            <div key={s.id} className="border border-ink/10 rounded-xl p-4 bg-paper grid gap-2">
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  value={s.stage}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[i] = { ...s, stage: e.target.value };
                    setServices(copy);
                  }}
                  placeholder="Stage (e.g. Build)"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
                <input
                  value={s.title}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[i] = { ...s, title: e.target.value };
                    setServices(copy);
                  }}
                  placeholder="Title"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
              </div>
              <textarea
                value={s.description}
                onChange={(e) => {
                  const copy = [...services];
                  copy[i] = { ...s, description: e.target.value };
                  setServices(copy);
                }}
                placeholder="Description"
                className="rounded-lg border border-ink/20 px-3 py-2"
                rows={2}
              />
              <input
                value={(s.tags || []).join(", ")}
                onChange={(e) => {
                  const copy = [...services];
                  copy[i] = { ...s, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) };
                  setServices(copy);
                }}
                placeholder="Tags, comma separated"
                className="rounded-lg border border-ink/20 px-3 py-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveService(services[i])}
                  className="rounded-full bg-teal text-white px-4 py-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => deleteService(s.id)}
                  className="rounded-full border border-rust text-rust px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-ink">Projects</h2>
          <button
            onClick={addProject}
            className="rounded-full bg-ink text-stone px-4 py-2 text-sm"
          >
            + Add project
          </button>
        </div>
        <div className="grid gap-4">
          {projects.map((p, i) => (
            <div key={p.id} className="border border-ink/10 rounded-xl p-4 bg-paper grid gap-2">
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  value={p.title}
                  onChange={(e) => {
                    const copy = [...projects];
                    copy[i] = { ...p, title: e.target.value };
                    setProjects(copy);
                  }}
                  placeholder="Title"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
                <select
                  value={p.category}
                  onChange={(e) => {
                    const copy = [...projects];
                    copy[i] = { ...p, category: e.target.value };
                    setProjects(copy);
                  }}
                  className="rounded-lg border border-ink/20 px-3 py-2"
                >
                  <option value="web">Web Development</option>
                  <option value="data">Data Analysis</option>
                  <option value="writing">Content Writing</option>
                </select>
              </div>
              <textarea
                value={p.summary}
                onChange={(e) => {
                  const copy = [...projects];
                  copy[i] = { ...p, summary: e.target.value };
                  setProjects(copy);
                }}
                placeholder="Summary"
                className="rounded-lg border border-ink/20 px-3 py-2"
                rows={2}
              />
              <div className="grid sm:grid-cols-3 gap-2">
                <input
                  value={p.url || ""}
                  onChange={(e) => {
                    const copy = [...projects];
                    copy[i] = { ...p, url: e.target.value };
                    setProjects(copy);
                  }}
                  placeholder="URL"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
                <input
                  value={p.contact_name || ""}
                  onChange={(e) => {
                    const copy = [...projects];
                    copy[i] = { ...p, contact_name: e.target.value };
                    setProjects(copy);
                  }}
                  placeholder="Referee name"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
                <input
                  value={p.contact_phone || ""}
                  onChange={(e) => {
                    const copy = [...projects];
                    copy[i] = { ...p, contact_phone: e.target.value };
                    setProjects(copy);
                  }}
                  placeholder="Referee phone"
                  className="rounded-lg border border-ink/20 px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveProject(projects[i])}
                  className="rounded-full bg-teal text-white px-4 py-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="rounded-full border border-rust text-rust px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
