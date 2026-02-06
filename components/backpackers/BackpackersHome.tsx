'use client';

import { useMemo, useState } from 'react';

import type { BackpackerGroup } from '@/data/backpackers';

import CreateGroupButton from './CreateGroupButton';
import GroupCardList from './GroupCardList';
import GroupFilters, { GroupFiltersState } from './GroupFilters';

const initialFilters: GroupFiltersState = {
  searchTerm: '',
  tripType: '',
  budget: '',
  month: '',
};

interface BackpackersHomeProps {
  groups?: BackpackerGroup[];
  initialFilters?: GroupFiltersState;
  onOpenLoginPopup?: () => void;
}

const budgetMatchers = {
  under25: (value: number) => value < 25000,
  '25to40': (value: number) => value >= 25000 && value <= 40000,
  '40plus': (value: number) => value > 40000,
};

export default function BackpackersHome({ groups = [], initialFilters: presetFilters, onOpenLoginPopup }: BackpackersHomeProps) {
  const [filters, setFilters] = useState<GroupFiltersState>(presetFilters ?? initialFilters);
  const [tripSource, setTripSource] = useState<'community' | 'hosted' | 'all'>('community');

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Filter by source: Prioritize the tripSource field if available.
      // Fallback to creatorId based check for older data.
      let isHosted = false;

      if (group.tripSource) {
        isHosted = group.tripSource === 'hosted';
      } else {
        // Legacy fallback
        isHosted = group.creatorId.toLowerCase().includes('admin') ||
          group.hostProfile?.verificationLevel === 'Official Host';
      }

      if (tripSource === 'hosted' && !isHosted) return false;
      if (tripSource === 'community' && isHosted) return false;
      // if tripSource is 'all', we don't return false based on source, efficiently showing both.

      const matchesSearch = `${group.groupName} ${group.destination} ${group.creatorId}`
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      const matchesTripType = filters.tripType ? group.tripType === filters.tripType : true;

      const matchesBudget = filters.budget
        ? budgetMatchers[filters.budget as keyof typeof budgetMatchers]?.(group.avgBudget) ?? true
        : true;

      const matchesMonth = filters.month
        ? new Date(group.startDate).toLocaleString('en-US', { month: 'long' }) === filters.month
        : true;

      return matchesSearch && matchesTripType && matchesBudget && matchesMonth;
    });
  }, [filters, groups, tripSource]);

  return (
    <div className="space-y-8 Mont">
      <GroupFilters
        filters={filters}
        onChange={setFilters}
      />

      <div className="flex flex-col gap-4 bg-green-500 rounded-[12px] border border-white/10  p-6 text-white backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Host corner</p>
          <h2 className="text-2xl font-semibold">Got an itinerary brewing?</h2>
          <p className="text-sm text-white/70">Use our guided form to open applications for your backpacker crew.</p>
        </div>
        <CreateGroupButton onOpenLoginPopup={onOpenLoginPopup || (() => { })} />
      </div>

      {/* Trip Source Selection Tabs */}
      <div className="border-b border-black/10 text-sm font-medium text-black/60 dark:border-white/10 dark:text-white/60">
        <ul className="flex flex-wrap -mb-px gap-6 justify-center">
          <li>
            <button
              onClick={() => setTripSource('community')}
              className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-200 ${tripSource === 'community'
                ? 'text-black border-black font-semibold'
                : 'border-transparent text-gray-600 hover:text-black hover:border-black/30'
                }`}
            >
              Travel Crews
            </button>
          </li>
          <li>
            <button
              onClick={() => setTripSource('hosted')}
              className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-200 ${tripSource === 'hosted'
                ? 'text-violet-600 border-violet-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-violet-600 hover:border-violet-600/30'
                }`}
            >
              Hosted Trips
            </button>
          </li>
          <li>
            <button
              onClick={() => setTripSource('all')}
              className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-200 ${tripSource === 'all'
                ? 'text-emerald-600 border-emerald-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-emerald-600 hover:border-emerald-600/30'
                }`}
            >
              Mixed View
            </button>
          </li>
        </ul>
      </div>

      <GroupCardList groups={filteredGroups} viewMode={tripSource} />
    </div>
  );
}
