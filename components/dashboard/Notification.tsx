import React from 'react';

const Notification: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notification</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Real-time notifications and alerts</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded bg-yellow-50">
            <div>
              <p className="font-medium">Trip request pending</p>
              <p className="text-sm text-gray-600">Sarah wants to join your trip</p>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
              View
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">New message</p>
              <p className="text-sm text-gray-600">You have 3 unread messages</p>
            </div>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              Read
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded bg-blue-50">
            <div>
              <p className="font-medium">Weather alert</p>
              <p className="text-sm text-gray-600">Rain expected for your trip</p>
            </div>
            <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;