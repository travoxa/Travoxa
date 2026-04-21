'use client'
import BackpackersHome from "@/components/backpackers/BackpackersHome";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useState } from "react";
import LoginRequiredPopup from "@/components/ui/LoginRequiredPopup";
import { route } from "@/lib/route";
import { useGroups } from "@/lib/hooks/useGroups";
import Spinner from "@/components/ui/Spinner";

export default function BackpackersPage() {
  const { groups, loading, error } = useGroups();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dots-svg mt-[50px] px-4 py-24 text-black sm:px-6 lg:px-12">
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

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="md" text="Loading groups..." />
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-red-500 text-center">
              Failed to load groups: {error}
            </div>
          )}

          {!loading && !error && (
            <BackpackersHome groups={groups} onOpenLoginPopup={() => setShowLoginPopup(true)} />
          )}
        </div>
      </main>
      <Footer />

      <LoginRequiredPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        triggerAction={() => route('/login')}
      />
    </>
  );
}
