'use client';

import { useApp } from '@/contexts/AppContext';
import { type Notification } from '@/types';

export default function NotificationPanel() {
  const { notifications, unreadCount, markAsRead } = useApp();

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'FOLLOW':
        return '👤';
      case 'POST':
        return '📝';
      case 'LIKE':
        return '❤️';
      case 'COMMENT':
        return '💬';
      default:
        return '📢';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {unreadCount}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No notifications yet</p>
          <p className="text-sm text-gray-500 mt-1">Your notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 rounded border transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-3 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
