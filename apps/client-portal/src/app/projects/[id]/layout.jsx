"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav, TopNavbar } from "@/components/dashboard";
import { Menu } from "lucide-react";

export default function ProjectLayout({ children }) {
  const [activeNavItem, setActiveNavItem] = useState("projects");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SidebarNav
            activeItem={activeNavItem}
            onItemClick={setActiveNavItem}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 z-50">
              <SidebarNav
                activeItem={activeNavItem}
                onItemClick={(itemId) => {
                  setActiveNavItem(itemId);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <TopNavbar
            title="Project Details"
            subtitle="Manage your project timeline, files, and communication"
            onSearch={handleSearch}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />

          {/* Mobile Menu Button - positioned absolutely over the top navbar */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden absolute top-4 left-4 z-10 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
