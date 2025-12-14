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
  groups: BackpackerGroup[];
  initialFilters?: GroupFiltersState;
}

const budgetMatchers = {
  under25: (value: number) => value < 25000,
  '25to40': (value: number) => value >= 25000 && value <= 40000,
  '40plus': (value: number) => value > 40000,
};

export default function BackpackersHome({ groups, initialFilters: presetFilters }: BackpackersHomeProps) {
  const [filters, setFilters] = useState<GroupFiltersState>(presetFilters ?? initialFilters);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
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
  }, [filters, groups]);

  return (
    <div className="space-y-8 Mont">
      <GroupFilters filters={filters} onChange={setFilters} />

      <div className="flex flex-col gap-4 bg-green-500 rounded-[12px] border border-white/10  p-6 text-white backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Host corner</p>
          <h2 className="text-2xl font-semibold">Got an itinerary brewing?</h2>
          <p className="text-sm text-white/70">Use our guided form to open applications for your backpacker crew.</p>
        </div>
        <CreateGroupButton />
      </div>

      <GroupCardList groups={filteredGroups} />
    </div>
  );
}
