"use client";

import { 
  MessageCircle, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  UserPlus,
  Calendar,
  Bell
} from "lucide-react";

export default function NotificationList({ 
  notifications = [],
  onNotificationClick,
  className = "" 
}) {
  const getIcon = (type) => {
    const iconMap = {
      message: MessageCircle,
      file: FileText,
      milestone: CheckCircle,
      alert: AlertCircle,
      user: UserPlus,
      meeting: Calendar,
      general: Bell,
    };
    
    const Icon = iconMap[type] || iconMap.general;
    return Icon;
  };

  const getIconColor = (type) => {
    const colorMap = {
      message: "text-blue-600 bg-blue-100",
      file: "text-green-600 bg-green-100",
      milestone: "text-purple-600 bg-purple-100",
      alert: "text-red-600 bg-red-100",
      user: "text-orange-600 bg-orange-100",
      meeting: "text-indigo-600 bg-indigo-100",
      general: "text-gray-600 bg-gray-100",
    };
    
    return colorMap[type] || colorMap.general;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (notifications.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
        <div className="text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No notifications yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 ${className}`}>
      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-neutral-200">
        {notifications.map((notification, index) => {
          const Icon = getIcon(notification.type);
          const iconColor = getIconColor(notification.type);
          
          return (
            <div
              key={index}
              className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() => onNotificationClick && onNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(notification.time)}
                  </p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
