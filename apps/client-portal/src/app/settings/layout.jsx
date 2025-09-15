"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav, TopNavbar } from "@/components/dashboard";
import { Menu } from "lucide-react";

export default function SettingsLayout({ children }) {
  const [activeNavItem, setActiveNavItem] = useState("settings");
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
    console.log("Logging out...");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
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
          <div className="bg-white border-b border-neutral-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Title and Subtitle */}
                <div className="flex-1 lg:ml-0 ml-4">
                  <h1 className="text-2xl font-bold text-neutral-900 mb-1">Settings</h1>
                  <p className="text-sm text-gray-500">Manage your account and preferences</p>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                  {/* Search Bar */}
                  <div className="relative hidden sm:block">
                    <input
                      type="text"
                      placeholder="Search settings..."
                      className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                    U
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
