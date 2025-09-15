"use client";

import NotificationItem from "./NotificationItem";

export default function NotificationList({ 
  notifications = [],
  className = "" 
}) {
  if (notifications.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-5 5v-5zM12 2a10 10 0 100 20 10 10 0 000-20z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p className="text-gray-500">
          You're all caught up! New notifications will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          message={notification.message}
          time={notification.time}
          isRead={notification.isRead}
        />
      ))}
    </div>
  );
}
