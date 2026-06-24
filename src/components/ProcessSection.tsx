export type ProcessStep = { id: string; title: string; description: string };

export default function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono-label text-xs uppercase text-teal mb-2">How it runs</p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">From scope to delivery.</h2>
      <div className="grid sm:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div key={step.id} className="relative pl-6 border-l-2 border-marigold/40">
            <span className="font-mono-label text-xs text-marigold-dark">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg text-ink mt-1">{step.title}</h3>
            <p className="text-sm text-ink-light mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
