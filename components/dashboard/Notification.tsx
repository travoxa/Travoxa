import React from 'react';
import { RiNotification3Line, RiCheckDoubleLine } from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItem {
  _id: string;
  senderId: string;
  message: string;
  seen: boolean;
  createdAt: string;
}

interface NotificationProps {
  notifications?: NotificationItem[];
  isInDropdown?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ notifications = [], isInDropdown = false }) => {
  const sortedNotifications = [...notifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={`bg-white ${isInDropdown ? '' : 'p-4 rounded-xl border border-gray-200'}`}>
      {!isInDropdown && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          <p className="text-xs text-gray-600">Real-time alerts and updates</p>
        </div>
      )}

      {isInDropdown && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
          {notifications.length > 0 && <span className="text-xs text-brand font-medium cursor-default">{notifications.filter(n => !n.seen).length} new</span>}
        </div>
      )}

      {sortedNotifications.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
            <RiNotification3Line size={24} />
          </div>
          <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
          <p className="text-gray-400 text-xs mt-1">We'll let you know when something arrives</p>
        </div>
      ) : (
        <div className={`space-y-0 ${isInDropdown ? 'max-h-[400px] overflow-y-auto custom-scrollbar' : ''}`}>
          {sortedNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!notification.seen ? 'bg-blue-50/30' : ''}`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.seen ? 'bg-blue-500' : 'bg-transparent'}`}></div>
              <div className="flex-1">
                <p className={`text-sm ${!notification.seen ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                  {notification.seen && <RiCheckDoubleLine className="text-blue-400" size={14} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isInDropdown && notifications.length > 0 && (
        <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
          <span className="text-[10px] text-gray-400">All notifications marked as read</span>
        </div>
      )}
    </div>
  );
};

export default Notification;