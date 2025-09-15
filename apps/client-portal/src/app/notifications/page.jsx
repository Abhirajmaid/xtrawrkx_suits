"use client";

import { useState, useCallback } from "react";
import { NotificationFilter, NotificationList } from "@/components/notifications";

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "file", // file | comment | milestone | chat | system
      message: "New file 'design-v2.pdf' uploaded to Project Apollo",
      time: "2h ago",
      isRead: false,
    },
    {
      id: 2,
      type: "comment",
      message: "Jane Doe commented on Task 'Homepage Redesign'",
      time: "4h ago",
      isRead: true,
    },
    {
      id: 3,
      type: "milestone",
      message: "Milestone 'Beta Release' marked complete",
      time: "1d ago",
      isRead: false,
    },
    {
      id: 4,
      type: "chat",
      message: "New message from John in Project Apollo thread",
      time: "1d ago",
      isRead: true,
    },
    {
      id: 5,
      type: "system",
      message: "Your password will expire in 5 days",
      time: "2d ago",
      isRead: true,
    },
    {
      id: 6,
      type: "file",
      message: "Specs document updated in Project Orion",
      time: "3d ago",
      isRead: false,
    },
  ];

  const handleFilterChange = useCallback((filter) => {
    setSelectedFilter(filter);
  }, []);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (selectedFilter) {
      case "unread":
        return !notification.isRead;
      case "files":
        return notification.type === "file";
      case "comments":
        return notification.type === "comment";
      case "milestones":
        return notification.type === "milestone";
      case "messages":
        return notification.type === "chat";
      default:
        return true; // "all"
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Stay updated with all your project activity and team communications
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-1 shadow-sm">
        <NotificationFilter
          selectedFilter={selectedFilter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
            </h2>
            <div className="text-sm text-gray-500">
              {selectedFilter === "all" ? "All notifications" : `Filtered by ${selectedFilter}`}
            </div>
          </div>
          
          <NotificationList notifications={filteredNotifications} />
        </div>
      </div>
    </div>
  );
}