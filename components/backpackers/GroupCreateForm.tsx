'use client';

import { FormEvent, useMemo, useState } from 'react';

const genderPreferenceOptions = [
  { label: 'No preference', value: 'any' },
  { label: 'Female only', value: 'female' },
  { label: 'Male only', value: 'male' },
];

const trekkingLevels = [
  { label: 'Beginner friendly', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced only', value: 'advanced' },
];

interface FormState {
  groupName: string;
  destination: string;
  startDate: string;
  endDate: string;
  maxMembers: number;
  tripType: string;
  budgetRange: string;
  pickupLocation: string;
  accommodationType: string;
  minAge: number;
  genderPreference: string;
  trekkingExperience: string;
  mandatoryRules: string;
  planOverview: string;
  itinerary: string;
  activities: string;
  estimatedCosts: string;
}

const initialState: FormState = {
  groupName: '',
  destination: '',
  startDate: '',
  endDate: '',
  maxMembers: 10,
  tripType: 'trek',
  budgetRange: '₹25k - ₹40k',
  pickupLocation: '',
  accommodationType: 'Hostels',
  minAge: 18,
  genderPreference: 'any',
  trekkingExperience: 'beginner',
  mandatoryRules: 'Travel respectfully\nCarry govt ID proofs',
  planOverview: '',
  itinerary: 'Day 1: Arrival meetup\nDay 2: Local exploration',
  activities: 'Sunrise hike,Food crawl,Open-mic night',
  estimatedCosts: 'stay:20000\ntransport:8000\nfood:6000',
};

const sectionClass = 'rounded-[12px] border border-black/10 bg-white p-6 shadow-2xl';
const labelClass = 'text-sm font-medium text-black/70';
const inputClass =
  'w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40';

const tripTypeOptions = [
  { label: 'Trek', value: 'trek' },
  { label: 'Bike ride', value: 'bike' },
  { label: 'Cultural immersion', value: 'cultural' },
  { label: 'Wellness / retreat', value: 'wellness' },
  { label: 'Open format', value: 'open' },
];

const parseKeyValueLines = (raw: string) => {
  return raw.split('\n').reduce<Record<string, number>>((acc, line) => {
    const [key, value] = line.split(':');
    if (!key || !value) return acc;
    acc[key.trim()] = Number(value.trim());
    return acc;
  }, {});
};

const parseList = (raw: string) => raw.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

export default function GroupCreateForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const totalCost = useMemo(() => {
    const values = Object.values(parseKeyValueLines(formState.estimatedCosts));
    return values.reduce((sum, value) => sum + value, 0);
  }, [formState.estimatedCosts]);

  const updateField = (field: keyof FormState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          mandatoryRules: parseList(formState.mandatoryRules),
          itinerary: parseList(formState.itinerary),
          activities: parseList(formState.activities),
          estimatedCosts: parseKeyValueLines(formState.estimatedCosts),
          tripType: formState.tripType,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setStatus('success');
    } catch (error) {
      console.error('Failed to create group', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">Group basics</p>
            <h2 className="text-2xl font-semibold">Describe the crew vibe</h2>
          </div>
          <span className="rounded-full bg-black/10 px-4 py-1 text-xs uppercase text-black/70">
            Avg. budget hint: ₹{totalCost.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Group name</label>
            <input
              className={inputClass}
              placeholder="Eg. Desert Campfire Collective"
              value={formState.groupName}
              onChange={(event) => updateField('groupName', event.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Destination</label>
            <input
              className={inputClass}
              placeholder="Eg. Spiti Valley"
              value={formState.destination}
              onChange={(event) => updateField('destination', event.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Start date</label>
            <input
              type="date"
              className={inputClass}
              value={formState.startDate}
              onChange={(event) => updateField('startDate', event.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>End date</label>
            <input
              type="date"
              className={inputClass}
              value={formState.endDate}
              onChange={(event) => updateField('endDate', event.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Max explorers</label>
            <input
              type="number"
              className={inputClass}
              value={formState.maxMembers}
              min={2}
              max={24}
              onChange={(event) => updateField('maxMembers', Number(event.target.value))}
            />
          </div>

          <div>
            <label className={labelClass}>Trip type</label>
            <select
              className={inputClass}
              value={formState.tripType}
              onChange={(event) => updateField('tripType', event.target.value)}
            >
              {tripTypeOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Budget range</label>
            <input
              className={inputClass}
              value={formState.budgetRange}
              onChange={(event) => updateField('budgetRange', event.target.value)}
              placeholder="Eg. ₹25k - ₹35k"
            />
          </div>

          <div>
            <label className={labelClass}>Pickup location</label>
            <input
              className={inputClass}
              value={formState.pickupLocation}
              onChange={(event) => updateField('pickupLocation', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Stay style</label>
            <input
              className={inputClass}
              value={formState.accommodationType}
              onChange={(event) => updateField('accommodationType', event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <p className="text-xs uppercase tracking-[0.3em] text-black/60">Plan specifics</p>
        <h3 className="text-xl font-semibold">Highlight the slow travel itinerary</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Plan overview</label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={formState.planOverview}
              onChange={(event) => updateField('planOverview', event.target.value)}
              placeholder="What makes this itinerary special?"
            />
          </div>

          <div>
            <label className={labelClass}>Itinerary (line per day)</label>
            <textarea
              className={`${inputClass} min-h-[150px] font-mono text-sm`}
              value={formState.itinerary}
              onChange={(event) => updateField('itinerary', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Activities (comma or newline)</label>
            <textarea
              className={`${inputClass} min-h-[150px] font-mono text-sm`}
              value={formState.activities}
              onChange={(event) => updateField('activities', event.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Estimated costs (key:value per line)</label>
            <textarea
              className={`${inputClass} min-h-[150px] font-mono text-sm`}
              value={formState.estimatedCosts}
              onChange={(event) => updateField('estimatedCosts', event.target.value)}
            />
            <p className="mt-2 text-xs text-black/60">Example: stay:22000</p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <p className="text-xs uppercase tracking-[0.3em] text-black/60">Approval criteria</p>
        <h3 className="text-xl font-semibold">Set entry expectations</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Minimum age</label>
            <input
              type="number"
              className={inputClass}
              value={formState.minAge}
              min={18}
              max={60}
              onChange={(event) => updateField('minAge', Number(event.target.value))}
            />
          </div>

          <div>
            <label className={labelClass}>Gender preference</label>
            <select
              className={inputClass}
              value={formState.genderPreference}
              onChange={(event) => updateField('genderPreference', event.target.value)}
            >
              {genderPreferenceOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Trekking experience</label>
            <select
              className={inputClass}
              value={formState.trekkingExperience}
              onChange={(event) => updateField('trekkingExperience', event.target.value)}
            >
              {trekkingLevels.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Mandatory rules</label>
            <textarea
              className={`${inputClass} min-h-[150px] font-mono text-sm`}
              value={formState.mandatoryRules}
              onChange={(event) => updateField('mandatoryRules', event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {status === 'success' && (
          <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            Crew submitted! Our team will review within 24 hours.
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            Something went off-track. Try again in a bit.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="ml-auto inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? 'Publishing...' : 'Publish backpacker crew'}
        </button>
      </div>
    </form>
  );
}
