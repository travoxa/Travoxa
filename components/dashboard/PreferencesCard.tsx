import React from 'react';

const PreferencesCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-light mb-4">Preferences</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Travel preferences and settings</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Experience
            </label>
            <select className="w-full p-2 border rounded">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comfort Level
            </label>
            <select className="w-full p-2 border rounded">
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