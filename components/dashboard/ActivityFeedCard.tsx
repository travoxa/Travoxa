import React from 'react';

const ActivityFeedCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Recent activity and community interactions</p>
        <div className="py-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
          <p className="text-gray-400 text-xs">No recent activity.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedCard;