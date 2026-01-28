import React from 'react';

const PreferencesCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Travel preferences and settings</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Travel Experience
            </label>
            <select className="w-full p-2 border border-gray-200 rounded text-xs">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Comfort Level
            </label>
            <select className="w-full p-2 border border-gray-200 rounded text-xs">
              <option>Basic</option>
              <option>Comfort</option>
              <option>Luxury</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesCard;