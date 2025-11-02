"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  adminOnly = false,
}) => {
  const { isAuthenticated, loading, user, hasPermission, hasRole, isAdmin } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Check admin requirement
      if (adminOnly && !isAdmin()) {
        router.push("/unauthorized");
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
        if (!hasRequiredRole) {
          router.push("/unauthorized");
          return;
        }
      }

      // Check permission requirements
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(
          ({ module, action }) => hasPermission(module, action)
        );
        if (!hasRequiredPermissions) {
          router.push("/unauthorized");
          return;
        }
      }
    }
  }, [
    isAuthenticated,
    loading,
    user,
    requiredPermissions,
    requiredRoles,
    adminOnly,
    router,
    hasPermission,
    hasRole,
    isAdmin,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // Check access requirements
  if (adminOnly && !isAdmin()) {
    return null; // Will redirect to unauthorized
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return null; // Will redirect to unauthorized
    }
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(
      ({ module, action }) => hasPermission(module, action)
    );
    if (!hasRequiredPermissions) {
      return null; // Will redirect to unauthorized
    }
  }

  return children;
};

export default ProtectedRoute;

