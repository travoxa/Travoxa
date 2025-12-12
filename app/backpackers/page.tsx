import BackpackersHome from "@/components/backpackers/BackpackersHome";
import { listGroups } from "@/data/backpackers";

export default function BackpackersPage() {
  const groups = listGroups();

  return (
    <main className="min-h-screen bg-dots-svg  px-4 py-24 text-black sm:px-6 lg:px-12">
      <div className="mx-auto max-w-8xl space-y-10">
        <header className="space-y-3 text-center Mont">
          <p className=" text-xs uppercase tracking-[0.7em] text-[var(--green)]">Backpackers club</p>
          <h1 className="text-[3.5vw] font-semibold leading-tight ">
            Discover slow-travel crews curated by real hosts
          </h1>
          <p className="text-base text-black">
            Filter biker convoys, trek collectives or creative retreats. All groups vetted by Travoxa team.
          </p>
        </header>

        <BackpackersHome groups={groups} />
      </div>
    </main>
  );
}
