"use client";

import "../styles/globals.css";
import CRMSidebar from "../components/CRMSidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* CRM Sidebar */}
          <CRMSidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
