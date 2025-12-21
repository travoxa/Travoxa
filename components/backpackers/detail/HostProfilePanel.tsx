import type { Badge, GroupDetail } from "@/data/backpackers";

interface HostProfilePanelProps {
  host: GroupDetail["host"];
  badges: Badge[];
}

const badgeThemeClass: Record<string, string> = {
  emerald: "bg-green-100 text-green-700 border-green-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function HostProfilePanel({ host, badges }: HostProfilePanelProps) {


  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Host</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold" style={{ backgroundColor: host.avatarColor }}>
          {host.handle.replace('@', '').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{host.handle}</h2>
          <p className="text-sm text-gray-600">{host.verificationLevel}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">{host.bio}</p>

      <dl className="mt-4 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <dt className="text-xs uppercase tracking-[0.3em] text-gray-600">Past trips</dt>
          <dd className="text-2xl font-semibold text-black">{host.pastTripsHosted}</dd>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <dt className="text-xs uppercase tracking-[0.3em] text-gray-600">Community badges</dt>
          <dd className="text-base text-black">{badges.length}</dd>
        </div>
      </dl>

      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full border px-3 py-1 text-xs uppercase ${badgeThemeClass[badge.theme] ?? 'border-gray-200 bg-gray-100 text-gray-700'}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {host.testimonials.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Testimonials</p>
          {host.testimonials.map((quote) => (
            <blockquote key={quote} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              “{quote}”
            </blockquote>
          ))}
        </div>
      )}
    </section>
  );
}
