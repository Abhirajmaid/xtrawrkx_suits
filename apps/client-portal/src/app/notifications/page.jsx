"use client";

import { useState, useCallback } from "react";
import { NotificationFilter, NotificationList } from "@/components/notifications";

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "chat",
      message: "Sarah Johnson sent you a message about the website redesign project",
      time: "2024-01-15T10:30:00Z",
      isRead: false,
    },
    {
      id: 2,
      type: "file",
      message: "New design files uploaded to Brand Identity project",
      time: "2024-01-15T09:15:00Z",
      isRead: false,
    },
    {
      id: 3,
      type: "milestone",
      message: "Project 'Mobile App Development' reached 75% completion",
      time: "2024-01-15T08:45:00Z",
      isRead: true,
    },
    {
      id: 4,
      type: "comment",
      message: "Mike Chen commented on the wireframes in Website Redesign",
      time: "2024-01-14T16:20:00Z",
      isRead: true,
    },
    {
      id: 5,
      type: "system",
      message: "Your project 'Marketing Campaign' deadline is approaching in 3 days",
      time: "2024-01-14T14:30:00Z",
      isRead: false,
    },
    {
      id: 6,
      type: "chat",
      message: "John Doe mentioned you in a message about the e-commerce platform",
      time: "2024-01-14T11:15:00Z",
      isRead: true,
    },
    {
      id: 7,
      type: "file",
      message: "Style guide document was updated in Website Redesign project",
      time: "2024-01-14T09:30:00Z",
      isRead: false,
    },
    {
      id: 8,
      type: "milestone",
      message: "Project 'Brand Identity' milestone 'Logo Design' has been completed",
      time: "2024-01-13T15:45:00Z",
      isRead: true,
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