"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";
import { UserProvider } from "./UserContext";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Define paths that should NOT use the admin layout
  const authPaths = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/signup",
    "/auth/verify-email",
    "/auth/mfa-setup",
    "/auth/mfa-verify",
  ];

  // Check if current path is an auth path
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  // Always wrap with UserProvider, but conditionally use AdminLayout
  return (
    <UserProvider>
      {isAuthPage ? children : <AdminLayout>{children}</AdminLayout>}
    </UserProvider>
  );
}
