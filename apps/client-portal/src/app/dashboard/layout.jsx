"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav, TopNavbar } from "@/components/dashboard";

export default function DashboardLayout({ children }) {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const router = useRouter();

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleLogout = () => {
    // Clear any stored auth data here
    console.log("Logging out...");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <SidebarNav
            activeItem={activeNavItem}
            onItemClick={setActiveNavItem}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <TopNavbar
            title="Dashboard"
            subtitle="Welcome back to your dashboard"
            onSearch={handleSearch}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar implementation can be added here if needed */}
      </div>
    </div>
  );
}
