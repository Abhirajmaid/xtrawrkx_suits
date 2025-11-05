"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import WorkspaceModal from "../page/WorkspaceModal";
import ManageWorkspaceModal from "../page/ManageWorkspaceModal";
import GlobalSearchModal from "../page/GlobalSearchModal";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";
import {
  useState,
  useCallback,
  useEffect,
  cloneElement,
  isValidElement,
} from "react";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isManageWorkspaceModalOpen, setIsManageWorkspaceModalOpen] =
    useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { createWorkspace } = useWorkspace();

  // Workspace modal handlers
  const handleCreateWorkspace = useCallback(
    (workspaceData) => {
      createWorkspace(workspaceData);
      setIsWorkspaceModalOpen(false);
    },
    [createWorkspace]
  );

  // Expose modal control to children via context or props
  const openWorkspaceModal = useCallback(() => {
    setIsWorkspaceModalOpen(true);
  }, []);

  const openManageWorkspaceModal = useCallback(() => {
    setIsManageWorkspaceModalOpen(true);
  }, []);

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  // Define routes that should NOT have sidebar and header
  const authRoutes = ["/signup", "/signup-demo", "/auth", "/login", "/unauthorized"];

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !isAuthenticated && !isAuthRoute) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, isAuthRoute, router]);

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

  // Handle authentication loading state
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

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    router.push('/auth');
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
            <span className="text-gray-900 font-medium">Redirecting to login...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthRoute) {
    // For auth pages, render children without sidebar/header
    return <div className="min-h-screen">{children}</div>;
  }

  // For all other pages, render with sidebar and header
  return (
    <div className="flex h-screen relative z-10">
      <Sidebar
        onOpenWorkspaceModal={openWorkspaceModal}
        onOpenManageWorkspaceModal={openManageWorkspaceModal}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {isValidElement(children)
          ? cloneElement(children, { onSearchClick: openSearchModal })
          : children}
      </main>

      {/* Workspace Modal - rendered at root level for proper positioning */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />

      {/* Manage Workspace Modal - rendered at root level for proper positioning */}
      <ManageWorkspaceModal
        isOpen={isManageWorkspaceModalOpen}
        onClose={() => setIsManageWorkspaceModalOpen(false)}
      />

      {/* Global Search Modal - rendered at root level for proper positioning */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}
