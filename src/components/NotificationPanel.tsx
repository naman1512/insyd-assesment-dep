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
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Notifications
        </h2>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <p className="text-slate-300 text-lg mb-2">Your notification center awaits</p>
          <p className="text-slate-400 text-sm">Stay tuned for real-time updates and social magic!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                notification.read 
                  ? 'bg-slate-700/30 border-slate-600/30' 
                  : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3 filter drop-shadow-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-100 mb-1">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          notification.read 
                            ? 'bg-slate-600 text-slate-300'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                        }`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-3 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-4 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full hover:from-blue-400 hover:to-purple-400 transition-all duration-300 font-medium shadow-lg"
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
