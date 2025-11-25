"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import Sidebar from "../components/shared/Sidebar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";
import WorkspaceModal from "../components/page/WorkspaceModal";
import ManageWorkspaceModal from "../components/page/ManageWorkspaceModal";
import GlobalSearchModal from "../components/page/GlobalSearchModal";
import { useWorkspace } from "../contexts/WorkspaceContext";
import { Loader2 } from "lucide-react";
import { useCallback, cloneElement, isValidElement } from "react";

function LayoutContent({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { createWorkspace } = useWorkspace();
  const pathname = usePathname();

  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isManageWorkspaceModalOpen, setIsManageWorkspaceModalOpen] =
    useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Don't show sidebar on login page - check both pathname and window.location as fallback
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : pathname;
  const isLoginPage = pathname === "/login" || currentPath === "/login";
  const isSignupPage =
    pathname === "/signup" ||
    pathname === "/signup-demo" ||
    currentPath === "/signup" ||
    currentPath === "/signup-demo";
  const isUnauthorizedPage =
    pathname === "/unauthorized" || currentPath === "/unauthorized";

  // Note: Authentication redirect is handled by middleware.js
  // We only need to show appropriate UI based on auth state here

  // Workspace modal handlers
  const handleCreateWorkspace = useCallback(
    (workspaceData) => {
      createWorkspace(workspaceData);
      setIsWorkspaceModalOpen(false);
    },
    [createWorkspace]
  );

  const openWorkspaceModal = useCallback(() => {
    setIsWorkspaceModalOpen(true);
  }, []);

  const openManageWorkspaceModal = useCallback(() => {
    setIsManageWorkspaceModalOpen(true);
  }, []);

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // For login, signup and unauthorized pages, render without sidebar
  if (isLoginPage || isUnauthorizedPage || isSignupPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // For authenticated users, show the full layout with sidebar
  if (isAuthenticated) {
    return (
      <div
        className="flex h-screen relative"
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

        {/* PM Sidebar */}
        <Sidebar
          onOpenWorkspaceModal={openWorkspaceModal}
          onOpenManageWorkspaceModal={openManageWorkspaceModal}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto relative z-10 bg-white">
          {isValidElement(children)
            ? cloneElement(children, { onSearchClick: openSearchModal })
            : children}
        </main>

        {/* Workspace Modal */}
        <WorkspaceModal
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          onCreateWorkspace={handleCreateWorkspace}
        />

        {/* Manage Workspace Modal */}
        <ManageWorkspaceModal
          isOpen={isManageWorkspaceModalOpen}
          onClose={() => setIsManageWorkspaceModalOpen(false)}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    );
  }

  // For unauthenticated users on protected routes
  // Check actual window location to prevent showing redirect message if already on login page
  const actualPath =
    typeof window !== "undefined" ? window.location.pathname : pathname;
  const isActuallyOnLoginPage =
    actualPath === "/login" || actualPath.startsWith("/login");

  // If we're actually on the login page, render it (middleware might have redirected)
  if (isActuallyOnLoginPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Otherwise show redirecting message (middleware will handle the actual redirect)
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
      <head>
        <title>PM Dashboard - Xtrawrkx Suite</title>
        <meta
          name="description"
          content="Comprehensive Project Management Dashboard for task management, team collaboration, and project tracking. Streamline your project operations with Xtrawrkx PM."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Robots Meta Tags */}
        <meta
          name="robots"
          content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
        />
        <meta
          name="googlebot"
          content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pm.xtrawrkx.com" />
        <meta
          property="og:title"
          content="Xtrawrkx PM Dashboard - Complete Project Management Solution"
        />
        <meta
          property="og:description"
          content="Powerful project management system for managing tasks, projects, and team collaboration. Boost your productivity with our comprehensive management tools."
        />
        <meta
          property="og:image"
          content="https://pm.xtrawrkx.com/logo_full.webp"
        />
        <meta property="og:site_name" content="Xtrawrkx PM Dashboard" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo_full.webp" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-white">
        <AuthProvider>
          <WorkspaceProvider>
            <LayoutContent>{children}</LayoutContent>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
