import GroupCreateForm from "@/components/backpackers/GroupCreateForm";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";

export default function CreateBackpackerGroupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-3 text-center Mont">
            <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">Host corner</p>
            <h1 className="text-[3.5vw] font-semibold leading-tight">
              Open a backpacker crew waitlist
            </h1>
            <p className="text-base text-black">
              Share your route, vibe and entry criteria. Our team vets every submission within 24 hours before it
              goes live on the Backpackers discovery feed.
            </p>
          </header>

          <GroupCreateForm />
        </div>
      </main>
      <Footor />
    </>
  );
}
