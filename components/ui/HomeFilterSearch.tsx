"use client";

import { useState } from "react";
import { FiMapPin, FiUser, FiClock, FiChevronDown, FiSliders, FiSearch } from "react-icons/fi";

export default function HomeFilterSearch() {
  const [destination] = useState("Melborn ,Australia");
  const [tripType] = useState("Any Trip Type");
  const [duration] = useState("2–4 days tour");
  const [guests] = useState(0);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-full border border-gray-200 p-2 inline-flex items-center gap-2 shadow-sm">

        {/* Buttons */}
        {/* Buttons */}
        {/* Buttons */}
        <button className="px-6 py-2 rounded-full bg-black text-white text-sm font-medium">Tour Packages</button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white">
            <span className="text-xs text-gray-500 font-medium">Date</span>
            <FiChevronDown className="text-gray-400 text-xs" />
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white">
            <span className="text-xs text-gray-500 font-medium">Budget</span>
            <FiChevronDown className="text-gray-400 text-xs" />
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white">
            <span className="text-xs text-gray-500 font-medium">Guest</span>
            <FiChevronDown className="text-gray-400 text-xs" />
          </div>

          <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors ml-2">
            <FiSearch size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

// divider component
function Divider() {
  return <div className="h-10 w-px bg-gray-300" />;
}
