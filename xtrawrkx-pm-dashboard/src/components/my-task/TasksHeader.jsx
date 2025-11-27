"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Upload,
  Download,
  ChevronDown,
  Plus,
  FileText,
  FileSpreadsheet,
  ChevronRight,
  User,
} from "lucide-react";
import { Card } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

export default function TasksHeader({
  searchQuery,
  setSearchQuery,
  setIsFilterModalOpen,
  setIsImportModalOpen,
  showExportDropdown,
  setShowExportDropdown,
  exportDropdownRef,
  handleExport,
  setIsModalOpen,
}) {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
    if (!user) return "Team Member";
    return user.primaryRole?.name || user.role || "Team Member";
  };

  return (
    <Card glass={true} className="relative z-50">
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-text-light mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-foreground font-medium">My Tasks</span>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
            My Tasks
          </h1>
          <p className="text-brand-text-light">
            Track and manage all of your tasks here
          </p>
        </div>

        {/* Right side enhanced UI */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Add New */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>

            {/* Filter */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
            >
              <Filter className="w-5 h-5 text-brand-text-light" />
            </button>

            {/* Import */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
            >
              <Upload className="w-5 h-5 text-brand-text-light" />
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
              >
                <Download className="w-5 h-5 text-brand-text-light" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport("pdf")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-3 text-red-500" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport("excel")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-3 text-green-500" />
                      Excel
                    </button>
                    <button
                      onClick={() => handleExport("csv")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-3 text-blue-500" />
                      CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                          <p className="font-semibold text-gray-900">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">
                          View Profile
                        </span>
                      </button>
                      <div className="h-px bg-gray-200 my-2 mx-3"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
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
  );
}
