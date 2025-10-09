"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { FloatingChatWidget } from "../chat/FloatingChatWidget";
import { ChatProvider } from "../providers/ChatProvider";

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Determine active section based on pathname
  const getActiveSection = () => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname.startsWith("/tasks")) return "tasks";
    if (pathname.startsWith("/messages")) return "messages";
    if (pathname.startsWith("/events")) return "events";
    if (pathname.startsWith("/communities")) return "communities";
    if (pathname.startsWith("/services")) return "services";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard"; // default
  };

  const activeSection = getActiveSection();

  return (
    <ChatProvider>
      <div
        className="min-h-screen flex relative"
        style={{
          background:
            "linear-gradient(135deg, #f1f3f6 0%, #e8eef3 25%, #dfe7ed 50%, #d6dee7 75%, #cdd5e0 100%)",
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/8 to-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-bl from-green-400/8 to-teal-500/5 rounded-full blur-3xl" />
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
          activeSection={activeSection}
        />

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col relative z-10 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {/* Top navigation */}
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>

        {/* Floating Chat Widget */}
        <FloatingChatWidget />
      </div>
    </ChatProvider>
  );
}
