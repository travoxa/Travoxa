import React from 'react';

const TripsCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-none">
      <h2 className="text-lg font-light mb-4">Trips</h2>
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Upcoming trips and crew management</p>
        <div className="space-y-3">
          <div className="p-3 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="text-sm font-medium">Trip to Mountains</h3>
            <p className="text-[10px] text-gray-500">Host: John Doe</p>
            <p className="text-[10px] text-gray-500">Date: Dec 25, 2025</p>
          </div>
          <div className="p-3 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="text-sm font-medium">Beach Adventure</h3>
            <p className="text-[10px] text-gray-500">Host: Jane Smith</p>
            <p className="text-[10px] text-gray-500">Date: Jan 15, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsCard;