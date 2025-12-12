import type { Badge, GroupDetail } from "@/data/backpackers";

interface HostProfilePanelProps {
  host: GroupDetail["host"];
  badges: Badge[];
}

const badgeThemeClass: Record<string, string> = {
  emerald: "bg-emerald-400/20 text-emerald-100 border-emerald-300/40",
  amber: "bg-amber-400/20 text-amber-100 border-amber-300/40",
  sky: "bg-sky-400/20 text-sky-100 border-sky-300/40",
  rose: "bg-rose-400/20 text-rose-100 border-rose-300/40",
};

export default function HostProfilePanel({ host, badges }: HostProfilePanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">Host</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold" style={{ backgroundColor: host.avatarColor }}>
          {host.handle.replace('@', '').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{host.handle}</h2>
          <p className="text-sm text-white/70">{host.verificationLevel}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/80">{host.bio}</p>

      <dl className="mt-4 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Past trips</dt>
          <dd className="text-2xl font-semibold text-white">{host.pastTripsHosted}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Community badges</dt>
          <dd className="text-base text-white">{badges.length}</dd>
        </div>
      </dl>

      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full border px-3 py-1 text-xs uppercase ${badgeThemeClass[badge.theme] ?? 'border-white/20 bg-white/5 text-white/80'}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {host.testimonials.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Testimonials</p>
          {host.testimonials.map((quote) => (
            <blockquote key={quote} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
              “{quote}”
            </blockquote>
          ))}
        </div>
      )}
    </section>
  );
}
