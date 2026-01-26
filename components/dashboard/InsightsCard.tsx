import React from 'react';

const InsightsCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-none">
      <h2 className="text-lg font-semibold mb-4">Insights</h2>
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Travel statistics and personalized insights</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="font-medium text-base">5</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-tight">Total Trips</p>
          </div>
          <div className="p-4 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="font-medium text-base">12</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-tight">Community Members</p>
          </div>
          <div className="p-4 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="font-medium text-base">3</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-tight">Countries Visited</p>
          </div>
          <div className="p-4 border border-gray-50/50 md:border-gray-50 rounded">
            <h3 className="font-medium text-base">1500</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-tight">Km Traveled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;