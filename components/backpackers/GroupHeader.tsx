import Image from "next/image";

import type { BackpackerGroup } from "@/data/backpackers";

interface GroupHeaderProps {
  group: BackpackerGroup;
}

export default function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative min-h-[320px]">
          <Image
            src={group.coverImage}
            alt={`${group.groupName} cover image`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">{group.destination}</p>
            <h1 className="text-3xl font-semibold md:text-4xl">{group.groupName}</h1>
            <p className="mt-3 text-sm text-white/80">{group.plan.overview}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase text-white/60">Trip window</p>
            <p className="text-lg font-semibold">
              {new Date(group.startDate).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}
              {" "}
              —
              {" "}
              {new Date(group.endDate).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-white/70">{group.duration} days • {group.tripType} experience</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile label="Base city" value={group.pickupLocation} />
            <InfoTile label="Stay style" value={group.accommodationType} />
            <InfoTile label="Budget" value={group.budgetRange} />
            <InfoTile label="Crew" value={`${group.currentMembers}/${group.maxMembers} confirmed`} />
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <p className="text-sm font-semibold text-emerald-200">Host handle</p>
            <p className="text-base text-white">@{group.creatorId.replace("user_", "")}</p>
            <p className="text-xs text-emerald-100/80">DM host for quick clarifications before applying.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InfoTileProps {
  label: string;
  value: string;
}

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase text-white/50">{label}</p>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  );
}
