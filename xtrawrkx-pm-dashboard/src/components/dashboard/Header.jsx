import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  User,
  Crown,
  HelpCircle,
  Globe,
  Package,
  MessageSquare,
  LogOut,
} from "lucide-react";

const Header = ({ onToggleData, title = "Home", subtitle = "Monitor all of your projects and tasks here" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userMenuItems = [
    { label: "Account Settings", icon: User, hasArrow: false },
    { label: "Upgrade to Plus", icon: Crown, hasArrow: false },
    { label: "Help Center", icon: HelpCircle, hasArrow: false },
    { label: "Language", icon: Globe, hasArrow: true },
    { label: "Product Updates", icon: Package, hasArrow: false },
    { label: "Leave a Feedback", icon: MessageSquare, hasArrow: false },
  ];

  const settingsMenuItems = [
    { label: "General Settings", icon: Settings, hasArrow: false },
    { label: "Notifications", icon: Bell, hasArrow: false },
    { label: "Privacy & Security", icon: User, hasArrow: false },
    { label: "Data & Storage", icon: HelpCircle, hasArrow: false },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">
              {subtitle}
            </p>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search anything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {/* Settings Header */}
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your preferences
                    </p>
                  </div>

                  {/* Settings Menu Items */}
                  <div className="py-2">
                    {settingsMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Add specific settings functionality here
                          setShowSettingsMenu(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span>{item.label}</span>
                        </div>
                        {item.hasArrow && (
                          <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JB</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {/* User Profile Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          JB
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Jonathan Bustos
                        </p>
                        <p className="text-sm text-gray-500">
                          jonathanbustos@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (
                            item.label === "Account Settings" &&
                            onToggleData
                          ) {
                            onToggleData(); // Toggle between empty and filled states
                          }
                          setShowUserMenu(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span>{item.label}</span>
                        </div>
                        {item.hasArrow && (
                          <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                        )}
                      </button>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Logout Button */}
                    <button
                      onClick={() => setShowUserMenu(false)}
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
    </div>
  );
};

export default Header;
