"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSubSidebar } from "../contexts/SubSidebarContext";
import {
  Search,
  Plus,
  Calendar,
  Bell,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  Share,
} from "lucide-react";
import { Card } from "./ui";

export default function DashboardHeader() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { subSidebarOpen } = useSubSidebar();
  const { user, logout } = useAuth();

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || user.name?.split(" ")[0] || "";
    const lastName = user.lastName || user.name?.split(" ")[1] || "";
    return (
      (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email || "User";
  };

  const getUserRole = () => {
    if (!user) return "User";
    return user.primaryRole?.name || user.role || "User";
  };

  return (
    <div className="relative">
      <Card glass={true} className="relative transition-all duration-300">
        <div className="flex items-center justify-between relative z-20">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-brand-text-light mb-2">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-brand-foreground font-medium">
                Dashboard
              </span>
            </div>

            {/* Title and Date */}
            <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
              Good Morning, {user?.firstName || "User"}
            </h1>
            <p className="text-brand-text-light">
              It's Wednesday, 11 November 2024
            </p>
          </div>

          {/* Right side enhanced UI */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Add New */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>

              {/* Calendar */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Calendar className="w-5 h-5 text-brand-text-light" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Bell className="w-5 h-5 text-brand-text-light" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Settings */}
              <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                <Settings className="w-5 h-5 text-brand-text-light" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-brand-border"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-brand-primary text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-brand-foreground">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-brand-text-light">
                        {getUserRole()}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-light transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-[99998]"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div
                      className="fixed right-6 top-20 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-[99999]"
                      onMouseEnter={() => setShowProfileDropdown(true)}
                      onMouseLeave={() => setShowProfileDropdown(false)}
                      style={{ zIndex: 99999 }}
                    >
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-brand-primary text-sm font-medium">
                              {getUserInitials()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-brand-foreground">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-sm text-brand-text-light">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                          <User className="w-4 h-4 text-brand-text-light" />
                          <span className="text-sm text-brand-foreground">
                            View Profile
                          </span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-brand-text-light" />
                          <span className="text-sm text-brand-foreground">
                            Settings
                          </span>
                        </button>
                        <div className="h-px bg-brand-border my-2 mx-3"></div>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Overlay when SubSidebar is open */}
      {subSidebarOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-25 z-50 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}
