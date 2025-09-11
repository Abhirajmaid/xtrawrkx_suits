"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import WorkspaceModal from "./WorkspaceModal";
import ManageWorkspaceModal from "./ManageWorkspaceModal";
import { useWorkspace } from "../contexts/WorkspaceContext";
import { useState, useCallback } from "react";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isManageWorkspaceModalOpen, setIsManageWorkspaceModalOpen] =
    useState(false);
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

  // Define routes that should NOT have sidebar and header
  const authRoutes = ["/signup", "/signup-demo", "/auth"];

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    // For auth pages, render children without sidebar/header
    return <div className="min-h-screen">{children}</div>;
  }

  // For all other pages, render with sidebar and header
  return (
    <div className="flex h-screen">
      <Sidebar onOpenWorkspaceModal={openWorkspaceModal} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

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
    </div>
  );
}
