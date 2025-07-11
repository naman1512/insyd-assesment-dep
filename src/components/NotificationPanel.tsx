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
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              {unreadCount}
            </span>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-gray-500 text-2xl">🔔</div>
          </div>
          <p className="text-gray-600 text-lg">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-2">Your notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                  : 'bg-white border-gray-300 shadow-sm hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shadow-md mr-3 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-white text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full border border-gray-300">
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed group-hover:text-gray-700">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-4 text-sm text-gray-600 hover:text-gray-800 transition-all duration-200 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 border border-gray-300 hover:border-gray-400 shadow-sm"
                  >
                    Mark as read
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
