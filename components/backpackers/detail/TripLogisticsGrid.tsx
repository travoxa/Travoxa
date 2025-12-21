interface TripLogisticsGridProps {
  pickupLocation: string;
  accommodationType: string;
  duration: number;
  budgetRange: string;
  currentMembers: number;
  maxMembers: number;
}

const tiles = [
  { label: "Base city", key: "pickupLocation" },
  { label: "Stay style", key: "accommodationType" },
  { label: "Duration", key: "duration" },
  { label: "Budget", key: "budgetRange" },
  { label: "Crew size", key: "currentMembers" },
];

export default function TripLogisticsGrid({
  pickupLocation,
  accommodationType,
  duration,
  budgetRange,
  currentMembers,
  maxMembers,
}: TripLogisticsGridProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Trip logistics</p>
          <h2 className="text-2xl font-semibold">Plan at a glance</h2>
        </div>
        <span className="rounded-full border border-gray-200 bg-green-50 px-4 py-1 text-sm text-gray-600">
          {currentMembers}/{maxMembers} confirmed
        </span>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => {
          const value = (() => {
            switch (tile.key) {
              case "pickupLocation":
                return pickupLocation;
              case "accommodationType":
                return accommodationType;
              case "duration":
                return `${duration} days`;
              case "budgetRange":
                return budgetRange;
              case "currentMembers":
                return `${currentMembers}/${maxMembers} travellers`;
              default:
                return "—";
            }
          })();

          return (
            <article key={tile.key} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-600">{tile.label}</p>
              <p className="text-lg font-semibold text-black">{value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
