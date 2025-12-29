import React from 'react';

const ActivityFeedCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">ActivityFeedCard</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Recent activity and community interactions</p>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border rounded">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium">John joined your trip</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">New comment on your post</p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded">
            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
            <div>
              <p className="font-medium">Trip approved successfully</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedCard;