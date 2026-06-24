export type Stat = { id: string; value: string; label: string };

export default function StatsBar({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 -mt-4 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-ink text-stone rounded-2xl p-6">
        {stats.map((s) => (
          <div key={s.id} className="text-center">
            <div className="font-display text-2xl sm:text-3xl text-marigold">{s.value}</div>
            <div className="font-mono-label text-[11px] uppercase text-stone/70 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
