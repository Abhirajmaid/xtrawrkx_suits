"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "../styles/globals.css";
import CRMSidebar from "../components/CRMSidebar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { SubSidebarProvider } from "../contexts/SubSidebarContext";
import { Loader2 } from "lucide-react";

function LayoutContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login";
  const isUnauthorizedPage = pathname === "/unauthorized";

  // Handle authentication redirect - MUST be at the top before any conditional returns
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage && !isUnauthorizedPage) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, isLoginPage, isUnauthorizedPage, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For login and unauthorized pages, render without sidebar
  if (isLoginPage || isUnauthorizedPage) {
    return children;
  }

  // For authenticated users, show the full layout with sidebar and top nav
  if (isAuthenticated) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* CRM Sidebar */}
        <CRMSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // For unauthenticated users on protected routes, show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white ">
        <AuthProvider>
          <SubSidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SubSidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
