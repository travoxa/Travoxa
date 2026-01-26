import React from 'react';

const Notification: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-none">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Real-time notifications and alerts</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-50/50 md:border-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Trip request pending</p>
              <p className="text-[10px] text-gray-600">Sarah wants to join your trip</p>
            </div>
            <button className="text-gray-500 border border-gray-50/50 md:border-gray-50 px-3 py-1 rounded text-[10px] hover:bg-gray-50 transition-colors">
              View
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-50/50 md:border-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">New message</p>
              <p className="text-[10px] text-gray-600">You have 3 unread messages</p>
            </div>
            <button className="text-gray-500 border border-gray-50/50 md:border-gray-50 px-3 py-1 rounded text-[10px] hover:bg-gray-50 transition-colors">
              Read
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-50/50 md:border-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Weather alert</p>
              <p className="text-[10px] text-gray-600">Rain expected for your trip</p>
            </div>
            <button className="text-gray-500 border border-gray-50/50 md:border-gray-50 px-3 py-1 rounded text-[10px] hover:bg-gray-50 transition-colors">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;