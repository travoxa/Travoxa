import Image from "next/image";
import Link from "next/link";

import type { BackpackerGroup } from "@/data/backpackers";

interface GroupCardListProps {
  groups: BackpackerGroup[];
  viewMode?: 'community' | 'hosted' | 'all';
}

const pillClass =
  "rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/70";

const formatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  day: "numeric",
});

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${formatter.format(startDate)} • ${formatter.format(endDate)}`;
};



export default function GroupCardList({ groups, viewMode = 'community' }: GroupCardListProps) {
  if (groups.length === 0) {
    return (
      <div className="mt-8 rounded-[12px] border-2 border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
        <p className="text-lg font-medium">There are no packages available</p>
        <p className="mt-2 text-sm">
          Check back later for new trips.
        </p>
      </div>
    );
  }


  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2 ">
      {groups.map((group) => {
        // Determine if the group is hosted
        let isHosted = false;
        if (group.tripSource) {
          isHosted = group.tripSource === 'hosted';
        } else {
          isHosted = group.creatorId.toLowerCase().includes('admin') ||
            group.hostProfile?.verificationLevel === 'Official Host';
        }

        // Conditional styling for mixed view
        const isMixedViewHosted = viewMode === 'all' && isHosted;
        const cardClass = isMixedViewHosted
          ? "flex flex-col overflow-hidden rounded-3xl border-2 border-violet-500 bg-[#000000fa]" // Violet border, no shadow
          : "flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000000fa] shadow-2xl shadow-emerald-500/5";

        return (
          <article
            key={group.id}
            className={cardClass}
          >
            <div className="relative h-56 w-full">
              <Image
                src={group.coverImage}
                alt={`${group.destination} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 text-xs font-semibold">
                <span className="rounded-full bg-black/70 px-3 py-1 uppercase text-white">{group.tripType}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-black">
                  {group.budgetRange}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-widest text-white/60">{group.destination}</p>
                  <h3 className="text-2xl font-semibold">{group.groupName}</h3>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-4 py-1 text-sm text-emerald-200">
                  {group.currentMembers}/{group.maxMembers} locked in
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-white/50">Trip window</p>
                  <p className="font-medium">{formatDateRange(group.startDate, group.endDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-white/50">Pickup point</p>
                  <p className="font-medium">{group.pickupLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-white/50">Stay style</p>
                  <p className="font-medium">{group.accommodationType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-white/50">Host</p>
                  <p className="font-medium">
                    {group.hostProfile?.name
                      ? group.hostProfile.name
                      : group.hostProfile?.handle
                        ? group.hostProfile.handle
                        : group.hostProfile?.handle || (group.creatorId ? `@${group.creatorId.replace("user_", "")}` : "Unknown Host")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.plan.activities.slice(0, 3).map((activity) => (
                  <span key={activity} className={pillClass}>
                    {activity}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm text-white/70 ">{group.plan.overview}</span>
                <Link
                  href={`/backpackers/group/${group.id}`}
                  className="w-[40%] text-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                >
                  View crew
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
