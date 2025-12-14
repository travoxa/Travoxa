import type { BackpackerGroup } from "@/data/backpackers";

interface RulesDisplayProps {
  group: BackpackerGroup;
}

const infoClass = "rounded-2xl border border-white/10 bg-white/5 p-4";

export default function RulesDisplay({ group }: RulesDisplayProps) {
  const { approvalCriteria, documentsRequired, bikerRequirements } = group;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Entry criteria</p>
        <h2 className="text-2xl font-semibold">Who fits this crew?</h2>
      </header>

      <div className="space-y-4">
        <div className={infoClass}>
          <p className="text-xs uppercase text-white/60">Minimum requirements</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Age {approvalCriteria.minAge}+ explorers only</li>
            <li>Gender preference: {approvalCriteria.genderPreference}</li>
            <li>Trekking vibe: {approvalCriteria.trekkingExperience}</li>
          </ul>
        </div>

        {bikerRequirements && (
          <div className={infoClass}>
            <p className="text-xs uppercase text-white/60">Biker specifics</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>License required: {bikerRequirements.licenseRequired ? "yes" : "no"}</li>
              <li>Riding gear: {bikerRequirements.ridingGearRequired ? "mandatory" : "optional"}</li>
              <li>Speed rules: {bikerRequirements.speedRules}</li>
            </ul>
          </div>
        )}

        <div className={infoClass}>
          <p className="text-xs uppercase text-white/60">Documents</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Aadhaar: {documentsRequired.aadhaar ? "required" : "optional"}</li>
            <li>Passport: {documentsRequired.passport ? "required" : "optional"}</li>
            <li>Emergency contact: {documentsRequired.emergencyContact ? "required" : "optional"}</li>
          </ul>
        </div>

        <div className={infoClass}>
          <p className="text-xs uppercase text-white/60">Non-negotiables</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
            {approvalCriteria.mandatoryRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
