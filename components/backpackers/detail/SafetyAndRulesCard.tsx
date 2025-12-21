import type { GroupDetail } from "@/data/backpackers";

interface SafetyAndRulesCardProps {
  approvalCriteria: GroupDetail["approvalCriteria"];
  documentsRequired: GroupDetail["documentsRequired"];
}

export default function SafetyAndRulesCard({ approvalCriteria, documentsRequired }: SafetyAndRulesCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Eligibility & paperwork</p>
          <h2 className="text-2xl font-semibold">Safety brief</h2>
        </div>
        <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1 text-xs uppercase text-green-700">
          Hosts vetted
        </span>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Entry rules</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Minimum age: {approvalCriteria.minAge}+</li>
            <li>Gender preference: {approvalCriteria.genderPreference}</li>
            <li>Experience level: {approvalCriteria.trekkingExperience}</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Documents Required</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {Object.entries(documentsRequired).map(([doc, required]) => (
              <li key={doc} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${required ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
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
        <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Mandatory rules</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-gray-600">
          {approvalCriteria.mandatoryRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
