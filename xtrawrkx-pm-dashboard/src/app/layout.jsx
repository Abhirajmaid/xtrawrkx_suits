"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isManageWorkspaceModalOpen, setIsManageWorkspaceModalOpen] =
    useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup" || pathname === "/signup-demo";
  const isUnauthorizedPage = pathname === "/unauthorized";

  // Handle authentication redirect - MUST be at the top before any conditional returns
  // Only redirect unauthenticated users to login (like CRM)
  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated &&
      !isLoginPage &&
      !isUnauthorizedPage &&
      !isSignupPage
    ) {
      router.push("/login");
    }
  }, [
    isAuthenticated,
    loading,
    isLoginPage,
    isUnauthorizedPage,
    isSignupPage,
    router,
  ]);

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
      <div className="min-h-screen relative overflow-hidden">
        {/* Full Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-400 to-pink-600">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 via-pink-300/20 to-pink-500/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/20 via-pink-400/15 to-pink-600/25"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
            <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
            <span className="text-gray-900 font-medium">Loading...</span>
          </div>
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
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-10">
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

  // For unauthenticated users on protected routes, show loading while redirecting
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-400 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 via-pink-300/20 to-pink-500/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/20 via-pink-400/15 to-pink-600/25"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
          <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
          <span className="text-gray-900 font-medium">
            Redirecting to login...
          </span>
        </div>
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
