import Image from "next/image";
import Link from "next/link";
import { PiArrowLeftBold } from "react-icons/pi";

import type { Badge } from "@/data/backpackers";

interface GroupHeroBannerProps {
  groupName: string;
  destination: string;
  tripWindow: string;
  coverImage: string;
  badges: Badge[];
}

export default function GroupHeroBanner({ groupName, destination, tripWindow, coverImage, badges }: GroupHeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white text-black shadow-2xl">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[360px]">
          <Image
            src={coverImage}
            alt={`${groupName} cover image`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4">
            <Link
              href="/backpackers"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <PiArrowLeftBold /> Back to crews
            </Link>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs uppercase tracking-wide text-gray-800"
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">{destination}</p>
            <h1 className="text-4xl font-semibold md:text-5xl text-white">{groupName}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span>{tripWindow}</span>
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span>Limited seats curated by real hosts</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-green-600">Why this crew</p>
            <p className="mt-3 text-base text-gray-600 text-[12px]">
              Designed for travellers who prefer slow itineraries, strong community vibes, and locally grounded stays.
            </p>
          </div>

          <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-green-600/80">Ready to apply?</p>
            <h2 className="mt-2 text-3xl font-semibold">Host is reviewing pitches now</h2>
            <p className="mt-3 text-sm text-green-600/80">Share your travel vibe and skills to unlock the next slot.</p>
            <Link
              href="#join-request"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5"
            >
              Request to join
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
