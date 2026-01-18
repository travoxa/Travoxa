import React from 'react';

const SafetyCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-light mb-4">Safety</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Safety information and emergency contacts</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter emergency contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              placeholder="Enter emergency contact phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Conditions
            </label>
            <textarea
              className="w-full p-2 border rounded"
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