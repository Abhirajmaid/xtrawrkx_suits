"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function TopNavbar({
  title = "Dashboard",
  subtitle = "Welcome back to your dashboard",
  onSearch,
  onNotificationClick,
  onProfileClick,
  onLogout,
  className = "",
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <header className={`bg-white border-b border-gray-100 ${className}`}>
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Title and subtitle */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-16 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64 lg:w-80 bg-gray-50 focus:bg-white transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded">
                    ⌘
                  </kbd>
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded">
                    K
                  </kbd>
                </div>
              </div>
            </form>

            {/* Notification Bell */}
            <button
              onClick={handleNotificationClick}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {/* User Profile Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          JD
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-500">
                          john@example.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleProfileClick();
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Account Settings</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>Settings</span>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
