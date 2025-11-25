"use client";

import { Bell } from "lucide-react";

export default function ActivityFeed({
  notifications,
  selectedNotification,
  onSelectNotification,
}) {
  const formatTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4 space-y-1">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => onSelectNotification(notification)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedNotification?.id === notification.id
                  ? "bg-orange-50 border-l-4 border-orange-500"
                  : notification.isRead
                  ? "hover:bg-gray-50"
                  : "hover:bg-orange-50 bg-white"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 relative">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {notification.initials}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`text-sm font-medium truncate ${
                        notification.isRead
                          ? "text-gray-700"
                          : "text-gray-900 font-semibold"
                      }`}
                    >
                      {notification.name}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {notification.timeAgo || formatTimeAgo(notification.date)}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 line-clamp-2 ${
                      notification.isRead ? "text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {notification.title || notification.message}
                  </p>
                  {notification.message && notification.title && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {notification.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
