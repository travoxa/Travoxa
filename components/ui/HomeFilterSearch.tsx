"use client";

import { useState } from "react";
import { FiMapPin, FiUser, FiClock, FiChevronDown, FiSliders, FiSearch } from "react-icons/fi";

export default function HomeFilterSearch() {
  const [destination] = useState("Melborn ,Australia");
  const [tripType] = useState("Any Trip Type");
  const [duration] = useState("2–4 days tour");
  const [guests] = useState(0);

  return (
    <div className="w-full mt-[-15vh] px-4 md:px-0 flex justify-center ">
      <div className="bg-white shadow-md rounded-xl p-5 w-[95vw] flex items-center gap-6 overflow-x-auto">

        {/* Destination */}
        <div className="flex items-start gap-3 min-w-[170px]">
          <FiMapPin className="text-green-600 text-xl mt-1" />
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-1">
              Destination
              <FiChevronDown className="text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">{destination}</p>
          </div>
        </div>

        <Divider />

        {/* Trip Type */}
        <div className="flex items-start gap-3 min-w-[170px]">
          <FiSliders className="text-green-600 rotate-90 text-xl mt-1" />
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-1">
              Trip Type
              <FiChevronDown className="text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">{tripType}</p>
          </div>
        </div>

        <Divider />

        {/* Duration */}
        <div className="flex items-start gap-3 min-w-[170px]">
          <FiClock className="text-green-600 text-xl mt-1" />
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-1">
              Duration
              <FiChevronDown className="text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">{duration}</p>
          </div>
        </div>

        <Divider />

        {/* Guests */}
        <div className="flex items-start gap-3 min-w-[170px]">
          <FiUser className="text-green-600 text-xl mt-1" />
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-1">
              Guests
              <FiChevronDown className="text-gray-500 text-sm" />
            </div>
            <p className="text-sm text-gray-600 mt-1">{guests}</p>
          </div>
        </div>

        {/* Search Button */}
        <button className="ml-auto flex justify-center items-center w-[20vw] flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition">
          <FiSearch className="text-lg" />
          Search
        </button>
      </div>
    </div>
  );
}

// divider component
function Divider() {
  return <div className="h-10 w-px bg-gray-300" />;
}
