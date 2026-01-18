import React from 'react';

const InsightsCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">InsightsCard</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Travel statistics and personalized insights</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium text-lg">5</h3>
            <p className="text-sm text-gray-600">Total Trips</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium text-lg">12</h3>
            <p className="text-sm text-gray-600">Community Members</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium text-lg">3</h3>
            <p className="text-sm text-gray-600">Countries Visited</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium text-lg">1500</h3>
            <p className="text-sm text-gray-600">Km Traveled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;