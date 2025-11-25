"use client";

import { Bell, Archive } from "lucide-react";
import { Card } from "../ui";

export default function NotificationDetail({ selectedNotification, onMarkAllRead }) {
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedNotification) {
    return (
      <Card glass={true} className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notification selected</h3>
          <p className="text-sm">Select a notification from the list to view details</p>
        </div>
      </Card>
    );
  }

  return (
    <Card glass={true} className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notification Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(selectedNotification.date)}
            </p>
          </div>
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notification Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gray-50">
        <div className="space-y-4">
          {/* Selected Notification */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {selectedNotification.initials}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedNotification.name}
                  </p>
                  {!selectedNotification.isRead && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Unread
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {selectedNotification.title}
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Type: <span className="font-medium">{selectedNotification.type || 'Notification'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-end">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors flex items-center space-x-2">
            <Archive className="h-4 w-4" />
            <span>Archive</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
