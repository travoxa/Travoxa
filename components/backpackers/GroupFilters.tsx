'use client';

import { ChangeEvent } from 'react';

export type GroupFiltersState = {
  searchTerm: string;
  tripType: string;
  budget: string;
  month: string;
};

interface GroupFiltersProps {
  filters: GroupFiltersState;
  onChange: (filters: GroupFiltersState) => void;
}

const tripTypes = ['trek', 'bike', 'cultural', 'wellness'];

const budgetOptions = [
  { label: 'Any budget', value: '' },
  { label: 'Under ₹25k', value: 'under25' },
  { label: '₹25k – ₹40k', value: '25to40' },
  { label: '₹40k+', value: '40plus' },
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const inputClass =
  'w-full rounded-[8px] border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur';

export default function GroupFilters({ filters, onChange, tripSource, onChangeTripSource }: GroupFiltersProps & { tripSource: 'community' | 'hosted'; onChangeTripSource: (source: 'community' | 'hosted') => void }) {
  const handleFieldChange = (
    field: keyof GroupFiltersState,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  return (
    <section className="rounded-[12px] bg-black p-6 text-white shadow-2xl backdrop-blur Mont space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-white/70">Find your travel tribe & Host</p>
          <h2 className="text-2xl font-semibold lg:text-3xl">Curate crews & Hosted trips in seconds</h2>
        </div>
        <p className="text-[12px] text-white/70">
          Filter by destination vibe, budget comfort and departure month to discover matching crews.
        </p>
      </div>

      {/* Navigation Bar */}
      <div className="flex flex-col gap-4 border-y border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => onChangeTripSource('community')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tripSource === 'community'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            Travel Crews
          </button>
          <button
            onClick={() => onChangeTripSource('hosted')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border-2 border-violet-500 ${tripSource === 'hosted'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            Hosted Trips
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-white">
            {tripSource === 'community' ? 'Community • Casual • Flexible Design' : 'Professional • Structured • Premium Design'}
          </p>
          <p className="text-xs text-white/60 mt-1">
            {tripSource === 'community'
              ? 'Join open groups created by fellow travelers'
              : 'Curated experiences hosted by verified admins'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium text-white/70 ">Search</label>
          <input
            type="text"
            placeholder="Destination or host"
            value={filters.searchTerm}
            onChange={(event) => handleFieldChange('searchTerm', event)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium text-white/70 ">Trip Type</label>
          <select
            value={filters.tripType}
            onChange={(event) => handleFieldChange('tripType', event)}
            className={inputClass}
          >
            <option value="">Any vibe</option>
            {tripTypes.map((type) => (
              <option key={type} value={type} className="text-slate-900">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium text-white/70 ">Budget Window</label>
          <select
            value={filters.budget}
            onChange={(event) => handleFieldChange('budget', event)}
            className={inputClass}
          >
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-slate-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium text-white/70 ">Departure Month</label>
          <select
            value={filters.month}
            onChange={(event) => handleFieldChange('month', event)}
            className={inputClass}
          >
            <option value="">Flexible</option>
            {months.map((month) => (
              <option key={month} value={month} className="text-slate-900">
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
