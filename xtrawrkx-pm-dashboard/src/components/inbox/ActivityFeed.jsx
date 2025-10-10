"use client";

import { useState } from "react";
import { CheckCircle, Archive } from "lucide-react";

export default function ActivityFeed({ notifications, selectedNotification, onSelectNotification }) {
  const [activeTab, setActiveTab] = useState("activity");

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full min-h-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "activity"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab("archive")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "archive"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Archive
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-1">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              onClick={() => onSelectNotification(notification)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedNotification?.id === notification.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt={notification.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {notification.initials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.name}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {notification.timeAgo ? formatTimeAgo(notification.timeAgo) : formatDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.action}
                  </p>
                  {notification.project && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      {notification.project}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
