export type Testimonial = {
  id: string;
  client_name: string;
  client_context: string | null;
  quote: string;
};

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 bg-paper rounded-3xl">
      <p className="font-mono-label text-xs uppercase text-teal mb-2">What clients say</p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">In their words.</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {items.map((t) => (
          <figure key={t.id} className="border border-ink/10 rounded-2xl p-6 bg-white/40">
            <blockquote className="font-display text-lg text-ink italic leading-snug">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-mono-label text-xs uppercase text-ink-light">
              {t.client_name}
              {t.client_context ? ` \u2014 ${t.client_context}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
