"use client";

import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import { ActivityFeed, NotificationDetail } from "../../components/inbox";
import notificationService from "../../lib/notificationService";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui";

export default function Inbox() {
  const { user, loading: authLoading } = useAuth();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, unread, read

  // Get current user ID
  const getCurrentUserId = () => {
    return user?.id || user?._id || user?.xtrawrkxUserId || null;
  };

  // Load notifications
  useEffect(() => {
    if (authLoading) return;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const currentUserId = getCurrentUserId();
        
        if (!currentUserId) {
          console.warn("No user ID found");
          setLoading(false);
          return;
        }

        const notificationsData = await notificationService.getNotifications(currentUserId);
        const transformed = notificationsData.map(notificationService.transformNotification);
        setNotifications(transformed);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user, authLoading]);

  // Real-time updates: Poll for new notifications every 5 seconds
  useEffect(() => {
    if (authLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return;

        const notificationsData = await notificationService.getNotifications(currentUserId);
        const transformed = notificationsData.map(notificationService.transformNotification);
        
        // Only update if notifications changed
        setNotifications((prev) => {
          const prevIds = new Set(prev.map((n) => n.id));
          const newIds = new Set(transformed.map((n) => n.id));
          
          const hasChanges =
            prev.length !== transformed.length ||
            prev.some((n) => {
              const updated = transformed.find((tn) => tn.id === n.id);
              return !updated || updated.isRead !== n.isRead;
            }) ||
            transformed.some((n) => !prevIds.has(n.id));
          
          return hasChanges ? transformed : prev;
        });
      } catch (error) {
        console.error("Error polling notifications:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [user?.id, authLoading]);

  // Handle selecting notification
  const handleSelectNotification = async (notification) => {
    setSelectedNotification(notification);
    
    // Mark as read when selected
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) return;

      await notificationService.markAllAsRead(currentUserId);
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead);

    return matchesSearch && matchesTab;
  });

  // Get stats
  const stats = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <PageHeader
            title="Inbox"
            subtitle="Stay updated with all your notifications"
            breadcrumb={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Inbox", href: "/inbox" },
            ]}
            showSearch={false}
            showActions={false}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <PageHeader
          title="Inbox"
          subtitle="Stay updated with all your notifications"
          breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Inbox", href: "/inbox" },
          ]}
          showSearch={true}
          showActions={false}
          searchPlaceholder="Search notifications..."
          onSearchChange={setSearchQuery}
        />

        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Notifications List */}
          <div className="w-96 space-y-4 flex-shrink-0">
            {/* Tabs */}
            <Card glass={true} className="p-0 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  All ({stats.all})
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "unread"
                      ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Unread ({stats.unread})
                </button>
                <button
                  onClick={() => setActiveTab("read")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "read"
                      ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Read ({stats.read})
                </button>
      </div>
            </Card>

            {/* Notifications List */}
            <Card glass={true} className="p-0 overflow-hidden flex-1 overflow-y-auto">
          <ActivityFeed
                notifications={filteredNotifications}
            selectedNotification={selectedNotification}
            onSelectNotification={handleSelectNotification}
          />
            </Card>
          </div>

          {/* Right Side - Notification Detail */}
          <div className="flex-1 flex flex-col">
          <NotificationDetail
            selectedNotification={selectedNotification}
            onMarkAllRead={handleMarkAllRead}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
