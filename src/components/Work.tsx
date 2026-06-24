export type Project = {
  id: string;
  title: string;
  summary: string;
  url?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  category: string;
  problem?: string | null;
  solution?: string | null;
  result?: string | null;
};

const categoryLabel: Record<string, string> = {
  web: "Web Development",
  data: "Data Analysis",
  writing: "Content Writing",
};

export default function Work({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono-label text-xs uppercase text-teal mb-2">Selected work</p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">
        Recent and reference projects
      </h2>

      <div className="grid gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-ink/10 rounded-2xl p-6 sm:p-8 bg-paper grid sm:grid-cols-[1fr_2fr] gap-6"
          >
            <div>
              <span className="font-mono-label text-[11px] uppercase text-rust">
                {categoryLabel[project.category] || project.category}
              </span>
              <h3 className="font-display text-2xl text-ink mt-2">{project.title}</h3>
              <p className="mt-2 text-ink-light">{project.summary}</p>
              {project.url && (
                <a
                  href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-teal underline"
                >
                  Visit site →
                </a>
              )}
              {project.contact_name && (
                <p className="mt-3 font-mono-label text-xs text-ink-light">
                  Referee: {project.contact_name}
                  {project.contact_phone ? ` · ${project.contact_phone}` : ""}
                </p>
              )}
            </div>

            {(project.problem || project.solution || project.result) && (
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {project.problem && (
                  <div>
                    <p className="font-mono-label text-[11px] uppercase text-ink-light mb-1">
                      Problem
                    </p>
                    <p className="text-ink">{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="font-mono-label text-[11px] uppercase text-ink-light mb-1">
                      What I built
                    </p>
                    <p className="text-ink">{project.solution}</p>
                  </div>
                )}
                {project.result && (
                  <div>
                    <p className="font-mono-label text-[11px] uppercase text-teal mb-1">
                      Result
                    </p>
                    <p className="text-ink">{project.result}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-ink-light">Add your first project from the admin panel.</p>
        )}
      </div>
    </section>
  );
}
