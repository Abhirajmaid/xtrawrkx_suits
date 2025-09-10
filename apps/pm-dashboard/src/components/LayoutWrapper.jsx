"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  const getHeaderTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/my-task")) return "My Tasks";
    if (pathname.startsWith("/inbox")) return "Inbox";
    if (pathname.startsWith("/message")) return "Message";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/projects")) return "Project Detail";
    return "Home";
  };

  const getHeaderSubtitle = () => {
    if (pathname === "/") return "Monitor all of your projects and tasks here";
    if (pathname.startsWith("/my-task")) return "Monitor all of your tasks here";
    if (pathname.startsWith("/inbox")) return "Manage your inbox and notifications";
    if (pathname.startsWith("/message")) return "Receive and send messages to your co-worker";
    if (pathname.startsWith("/settings")) return "Update your account and preferences";
    if (pathname.startsWith("/projects")) return "Manage project and tasks here";
    return "Monitor all of your projects and tasks here";
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title={getHeaderTitle()} subtitle={getHeaderSubtitle()} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
