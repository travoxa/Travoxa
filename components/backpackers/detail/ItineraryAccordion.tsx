'use client';

import { useState } from "react";

import type { GroupDetail } from "@/data/backpackers";

interface ItineraryAccordionProps {
  plan: GroupDetail["plan"];
}

export default function ItineraryAccordion({ plan }: ItineraryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Itinerary</p>
          <h2 className="text-2xl font-semibold">How the days flow</h2>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-white/80">
          {plan.itinerary.length} itinerary drops
        </span>
      </header>

      <p className="mt-3 text-sm text-white/70">{plan.overview}</p>

      <div className="mt-6 space-y-3">
        {plan.itinerary.map((summary, index) => {
          const isOpen = openIndex === index;
          return (
            <button
              key={summary}
              type="button"
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              className="flex w-full flex-col rounded-2xl border border-white/15 bg-black/30 p-4 text-left transition hover:border-white/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Day {index + 1}</p>
                  <p className="text-base font-semibold text-white">{summary}</p>
                </div>
                <span className="text-sm text-white/60">{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <p className="mt-3 text-sm text-white/70">
                  Hosts will share the hour-by-hour plan once your join request is approved. Expect added surprises tailored
                  to the crew vibe.
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Highlight activities</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {plan.activities.map((activity) => (
            <span key={activity} className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase">
              {activity}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
