import GroupCreateForm from "@/components/backpackers/GroupCreateForm";

export default function CreateBackpackerGroupPage() {
  return (
    <main className="min-h-screen bg-slate-950/95 px-4 py-24 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.7em] text-emerald-200">Host corner</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Open a backpacker crew waitlist</h1>
          <p className="text-base text-white/80">
            Share your route, vibe and entry criteria. Our team vets every submission within 24 hours before it
            goes live on the Backpackers discovery feed.
          </p>
        </header>

        <GroupCreateForm />
      </div>
    </main>
  );
}
