"use client";

import { useState } from "react";
import { InboxHeader, ActivityFeed, NotificationDetail } from "./components";

export default function Inbox() {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      name: "Mark Atenson",
      initials: "MA",
      avatar: null,
      action: "Assigned you to",
      project: "Mogo Web Design project",
      timeAgo: "9 hours ago",
      date: "2024-01-29T15:00:00Z"
    },
    {
      id: 2,
      name: "Susan Drake",
      initials: "SD",
      avatar: null,
      action: "Commented on",
      project: "Logo Options task",
      timeAgo: "1 day ago",
      date: "2024-01-28T10:00:00Z"
    },
    {
      id: 3,
      name: "Jane Cooper",
      initials: "JC",
      avatar: null,
      action: "Mentioned you in the",
      project: "About Us Illustration comment",
      date: "2024-01-28T08:00:00Z"
    },
    {
      id: 4,
      name: "Mark Atenson",
      initials: "MA",
      avatar: null,
      action: "Invited James Hubner to this workspace",
      project: null,
      date: "2024-01-26T14:00:00Z"
    },
    {
      id: 5,
      name: "Ronald Richards",
      initials: "RR",
      avatar: null,
      action: "Marked",
      project: "Homepage Wireframe as Done",
      date: "2024-01-26T11:00:00Z"
    },
    {
      id: 6,
      name: "Jane Cooper",
      initials: "JC",
      avatar: null,
      action: "Set",
      project: "Order Flow to be due Feb 13, 2024",
      date: "2024-01-25T16:00:00Z"
    },
    {
      id: 7,
      name: "Mark Atenson",
      initials: "MA",
      avatar: null,
      action: "Created",
      project: "Moodboarding Task for Carl UI/UX...",
      date: "2024-01-24T09:00:00Z"
    },
    {
      id: 8,
      name: "Susan Drake",
      initials: "SD",
      avatar: null,
      action: "Invited you to",
      project: "Hajime Illustration project",
      date: "2024-01-24T13:00:00Z"
    },
    {
      id: 9,
      name: "Susan Drake",
      initials: "SD",
      avatar: null,
      action: "Removed you from",
      project: "Pink AI project...",
      date: "2024-01-23T15:00:00Z"
    }
  ];

  // Mock data for comments
  const comments = [
    {
      name: "Jane Cooper",
      initials: "JC",
      avatar: null,
      message: "mentioned you in the About Us Illustration comment",
      date: "2024-01-28T08:00:00Z"
    },
    {
      name: "Jonathan Bustos",
      initials: "JB",
      avatar: null,
      message: "Hi Jane, please check this and make sure all the URL's is accessible",
      date: "2024-01-27T10:00:00Z"
    },
    {
      name: "Jane Cooper",
      initials: "JC",
      avatar: null,
      message: "Hi @Jonathan Bustos, The client's figma file is broken and I need a permission to access the google drive. Could you please assist me with this? 😊",
      date: "2024-01-28T08:30:00Z",
      link: "View Original Comment"
    }
  ];

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
  };

  const handleMarkAllRead = () => {
    console.log("Marking all notifications as read");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <InboxHeader />
      <div className="flex-1 flex overflow-hidden min-h-0 pt-16 pb-16">
        <div className="flex w-full max-w-7xl mx-auto px-4">
          <ActivityFeed
            notifications={notifications}
            selectedNotification={selectedNotification}
            onSelectNotification={handleSelectNotification}
          />
          <NotificationDetail
            selectedNotification={selectedNotification}
            comments={comments}
            onMarkAllRead={handleMarkAllRead}
          />
        </div>
      </div>
    </div>
  );
}