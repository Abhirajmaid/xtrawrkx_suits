"use client";

import { useState } from "react";
import "../styles/globals.css";
import CRMSidebar from "../components/CRMSidebar";

export default function RootLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* CRM Sidebar */}
          <CRMSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
