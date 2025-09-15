"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  FolderOpen,
  MessageCircle,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SidebarNav({ 
  activeItem = "dashboard",
  onItemClick,
  className = "" 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleItemClick = (itemId) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
    
    // Navigate to the appropriate page
    switch (itemId) {
      case "dashboard":
        router.push("/dashboard");
        break;
      case "projects":
        router.push("/projects");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "settings":
        router.push("/settings");
        break;
      default:
        break;
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 border-r border-neutral-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} ${className}`}>
      {/* Header */}
      <div className={`border-b border-neutral-200 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <div 
          className={`flex items-center cursor-pointer hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center mb-3' : 'gap-3 mb-4'}`}
          onClick={() => router.push("/dashboard")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-neutral-900">
              Client Portal
            </h1>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-center bg-white/50 hover:bg-white/70 rounded-lg transition-colors ${isCollapsed ? 'w-12 h-8 mx-auto' : 'w-full p-2'}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-neutral-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-neutral-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className={`flex-1 space-y-2 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center rounded-xl transition-all duration-300 group ${
                isCollapsed 
                  ? `w-12 h-12 justify-center mx-auto ${isActive ? 'bg-blue-100 shadow-md' : 'hover:bg-white/70'}`
                  : `w-full gap-3 px-3 py-2.5 ${isActive ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm' : 'text-neutral-600 hover:bg-white/70 hover:text-neutral-900'}`
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-neutral-500 group-hover:text-neutral-700"
                } transition-colors`}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`border-t border-neutral-200 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-center bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer ${isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'gap-3 p-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-lg">U</span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-neutral-900">User Name</p>
              <p className="text-xs text-neutral-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
