import type { GroupDetail } from "@/data/backpackers";

interface SafetyAndRulesCardProps {
  approvalCriteria: GroupDetail["approvalCriteria"];
  documentsRequired: GroupDetail["documentsRequired"];
}

export default function SafetyAndRulesCard({ approvalCriteria, documentsRequired }: SafetyAndRulesCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Eligibility & paperwork</p>
          <h2 className="text-2xl font-semibold">Safety brief</h2>
        </div>
        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-4 py-1 text-xs uppercase text-emerald-100">
          Hosts vetted
        </span>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Entry rules</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Minimum age: {approvalCriteria.minAge}+</li>
            <li>Gender preference: {approvalCriteria.genderPreference}</li>
            <li>Experience level: {approvalCriteria.trekkingExperience}</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Documents</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {Object.entries(documentsRequired).map(([doc, required]) => (
              <li key={doc} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${required ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/10 text-white/50'}`}
                >
                  {required ? '✓' : '–'}
                </span>
                <span className="capitalize">{doc.replace(/([A-Z])/g, ' $1')}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Mandatory rules</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-white/80">
          {approvalCriteria.mandatoryRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
