"use client";

import { useEffect, useRef } from "react";

export type Service = {
  id: string;
  stage: string;
  title: string;
  description: string;
  tags: string[];
  proof_stat?: string | null;
};

export default function CapabilityLedger({ services }: { services: Service[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.classList.add("in-view");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const rowHeight = 140;
  const totalHeight = rowHeight * Math.max(services.length, 1);

  return (
    <section id="capabilities" ref={sectionRef} className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono-label text-xs uppercase text-teal mb-2">The ledger</p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">
        Four stages. One thread.
      </h2>

      <div className="relative grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr] gap-x-2">
        <svg
          width="48"
          height={totalHeight}
          viewBox={`0 0 48 ${totalHeight}`}
          className="absolute left-0 top-2 hidden sm:block"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={`M24,10 ${services
              .map((_, i) => `L24,${rowHeight * (i + 1) - rowHeight / 2}`)
              .join(" ")}`}
            stroke="#e0a634"
            strokeWidth="2"
            fill="none"
            className="thread-path"
          />
        </svg>

        <div className="col-span-2 sm:col-start-2 divide-y divide-ink/10">
          {services.map((service, i) => (
            <div key={service.id} className="py-8 grid sm:grid-cols-[6rem_1fr] gap-4">
              <div className="font-mono-label text-xs text-marigold-dark">
                {String(i + 1).padStart(2, "0")} / {service.stage.toUpperCase()}
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                <p className="mt-2 text-ink-light max-w-2xl">{service.description}</p>
                {service.proof_stat && (
                  <p className="mt-2 font-mono-label text-xs uppercase text-rust">
                    {service.proof_stat}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-label text-[11px] uppercase rounded-full border border-teal/40 text-teal px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
