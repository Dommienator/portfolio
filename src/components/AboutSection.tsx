export type Settings = {
  full_name: string;
  tagline: string;
  about_text: string;
  availability_status: string;
  response_time: string;
  hours_per_week: string;
  email?: string;
  phone?: string;
};

export default function AboutSection({ settings }: { settings: Settings }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 grid sm:grid-cols-3 gap-10">
      <div className="sm:col-span-2">
        <p className="font-mono-label text-xs uppercase text-teal mb-2">Why this combination</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-6">
          One background, four working parts.
        </h2>
        <p className="text-ink-light whitespace-pre-line leading-relaxed">{settings.about_text}</p>
      </div>
      <div className="rounded-2xl bg-paper border border-ink/10 p-6 h-fit">
        <p className="font-mono-label text-xs uppercase text-teal mb-3">Right now</p>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-ink-light">Status</dt>
            <dd className="font-medium text-ink">{settings.availability_status}</dd>
          </div>
          <div>
            <dt className="text-ink-light">Typical response</dt>
            <dd className="font-medium text-ink">{settings.response_time}</dd>
          </div>
          <div>
            <dt className="text-ink-light">Capacity</dt>
            <dd className="font-medium text-ink">{settings.hours_per_week}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
