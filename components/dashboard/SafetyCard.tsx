import React from 'react';

const SafetyCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Safety information and emergency contacts</p>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Emergency Contact Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded text-xs"
              placeholder="Enter emergency contact name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-200 rounded text-xs"
              placeholder="Enter emergency contact phone"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-700 mb-1 uppercase tracking-tight">
              Medical Conditions
            </label>
            <textarea
              className="w-full p-2 border border-gray-200 rounded text-xs"
              placeholder="List any medical conditions"
              rows={3}
            />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a 
            href="/dashboard/delete-account" 
            className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tight flex items-center"
          >
            Delete Account Data Permanently
          </a>
          <p className="text-[9px] text-gray-400 mt-1">This action is irreversible and will remove all your trip data.</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyCard;