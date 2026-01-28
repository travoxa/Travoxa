import React from 'react';

const Notification: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Real-time notifications and alerts</p>
        <div className="py-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
          <p className="text-gray-400 text-xs">No new notifications.</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;