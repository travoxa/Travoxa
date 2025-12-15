'use client';

import { PiCompassBold } from "react-icons/pi";
import { useSession } from "next-auth/react";
import { route } from "@/lib/route";

interface CreateGroupButtonProps {
  onOpenLoginPopup: () => void;
}

export default function CreateGroupButton({ onOpenLoginPopup }: CreateGroupButtonProps) {
  const { data: session } = useSession();

  const handleClick = () => {
    if (!session?.user?.email) {
      onOpenLoginPopup();
    } else {
      route('/backpackers/create');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-white to-emerald-50 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5"
    >
      <PiCompassBold className="text-lg text-emerald-500" />
      Host a backpacker crew
    </button>
  );
}
