export type HeroSettings = {
  full_name: string;
  tagline: string;
};

export default function Hero({ settings }: { settings: HeroSettings }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-24 sm:pb-12 grid sm:grid-cols-5 gap-10">
      <div className="sm:col-span-3">
        <p className="font-mono-label text-xs uppercase text-teal mb-4">
          Build &middot; Analyze &middot; Write &middot; Transact
        </p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] text-ink">
          {settings.full_name} —
          <span className="italic text-rust"> one connected </span>
          skill set.
        </h1>
        <p className="mt-6 text-lg text-ink-light max-w-xl">{settings.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="rounded-full bg-ink px-6 py-3 text-stone font-medium hover:bg-ink-light transition-colors"
          >
            Start a project
          </a>
          <a
            href="#work"
            className="rounded-full border border-ink px-6 py-3 text-ink font-medium hover:border-teal hover:text-teal transition-colors"
          >
            See the work
          </a>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-end">
        <div className="w-full rounded-2xl bg-ink text-stone p-6 font-mono-label text-sm leading-relaxed">
          <p className="text-marigold mb-2">// why one practice, not four</p>
          <p>a site is built →</p>
          <p>its traffic gets read →</p>
          <p>its story gets written →</p>
          <p>its sales get collected.</p>
        </div>
      </div>
    </section>
  );
}
