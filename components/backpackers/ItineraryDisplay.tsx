import type { BackpackerGroup } from "@/data/backpackers";

interface ItineraryDisplayProps {
  plan: BackpackerGroup["plan"];
}

export default function ItineraryDisplay({ plan }: ItineraryDisplayProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Plan overview</p>
          <h2 className="text-2xl font-semibold">What's the vibe?</h2>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-white/80">
          Avg. cost: ₹{Object.values(plan.estimatedCosts).reduce((total, cost) => total + cost, 0).toLocaleString("en-IN")}
        </span>
      </div>

      <p className="mt-3 text-sm text-white/80">{plan.overview}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm uppercase text-white/60">Itinerary drops</h3>
          <ul className="space-y-3 text-sm text-white/80">
            {plan.itinerary.map((day, index) => (
              <li key={day} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mr-3 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Day {index + 1}</span>
                {day}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm uppercase text-white/60">Activities</h3>
          <div className="flex flex-wrap gap-2">
            {plan.activities.map((activity) => (
              <span key={activity} className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase">
                {activity}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-sm uppercase text-white/60">Estimated spends</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {Object.entries(plan.estimatedCosts).map(([category, cost]) => (
                <li key={category} className="flex justify-between rounded-2xl bg-white/5 px-4 py-2">
                  <span className="capitalize">{category}</span>
                  <span>₹{cost.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
