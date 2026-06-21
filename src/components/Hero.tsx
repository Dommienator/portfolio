export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 grid sm:grid-cols-5 gap-10">
      <div className="sm:col-span-3">
        <p className="font-mono-label text-xs uppercase text-teal mb-4">
          Build &middot; Analyze &middot; Write &middot; Transact
        </p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] text-ink">
          One person, one
          <span className="italic text-rust"> connected </span>
          skill set.
        </h1>
        <p className="mt-6 text-lg text-ink-light max-w-xl">
          I build websites, read the data they generate, write the words that
          fill them, and wire up the payments that come through them — as one
          continuous practice, not four unrelated gigs.
        </p>
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
