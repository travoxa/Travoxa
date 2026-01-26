import React from 'react';

const SafetyCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-none">
      <h2 className="text-lg font-light mb-4">Safety</h2>
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Safety information and emergency contacts</p>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Emergency Contact Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-50/50 md:border-gray-50 rounded text-xs"
              placeholder="Enter emergency contact name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-50/50 md:border-gray-50 rounded text-xs"
              placeholder="Enter emergency contact phone"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Medical Conditions
            </label>
            <textarea
              className="w-full p-2 border border-gray-50/50 md:border-gray-50 rounded text-xs"
              placeholder="List any medical conditions"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCard;