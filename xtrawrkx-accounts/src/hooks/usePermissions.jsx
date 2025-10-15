import { useState, useEffect, useCallback } from "react";
import permissionsService from "@/lib/permissionsService";
import { getCurrentUser } from "@/lib/auth";

/**
 * Custom hook for managing user permissions
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializePermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser || !currentUser.user) {
        throw new Error("No authenticated user found");
      }

      // Initialize permissions service
      const userPermissions = await permissionsService.initializePermissions(
        currentUser.user.id
      );
      const userRoles = permissionsService.getUserRoles();

      setPermissions(userPermissions);
      setRoles(userRoles);
    } catch (err) {
      console.error("Error initializing permissions:", err);
      setError(err.message);

      // Fallback to default permissions based on user role
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.user?.primaryRole) {
          const defaultPermissions = permissionsService.getDefaultPermissions(
            currentUser.user.primaryRole
          );
          setPermissions(defaultPermissions);
        }
      } catch (fallbackError) {
        console.error("Error getting fallback permissions:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePermissions();
  }, [initializePermissions]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((module, action) => {
    return permissionsService.hasPermission(module, action);
  }, []);

  /**
   * Check if user has any permission in a module
   */
  const hasAnyPermission = useCallback((module) => {
    return permissionsService.hasAnyPermission(module);
  }, []);

  /**
   * Get all permissions for a module
   */
  const getModulePermissions = useCallback((module) => {
    return permissionsService.getModulePermissions(module);
  }, []);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((roleName) => {
    return permissionsService.hasRole(roleName);
  }, []);

  /**
   * Refresh permissions from server
   */
  const refreshPermissions = useCallback(async () => {
    await initializePermissions();
  }, [initializePermissions]);

  /**
   * Clear permissions (useful for logout)
   */
  const clearPermissions = useCallback(() => {
    permissionsService.clearPermissions();
    setPermissions(null);
    setRoles([]);
  }, []);

  /**
   * Check if current user can edit target user based on role hierarchy
   */
  const canEditUser = useCallback((currentUserRole, targetUserRole) => {
    return permissionsService.canEditUser(currentUserRole, targetUserRole);
  }, []);

  /**
   * Check if current user can edit primary roles
   */
  const canEditPrimaryRole = useCallback((currentUserRole) => {
    return permissionsService.canEditPrimaryRole(currentUserRole);
  }, []);

  /**
   * Get available roles that current user can assign
   */
  const getAssignableRoles = useCallback((currentUserRole) => {
    return permissionsService.getAssignableRoles(currentUserRole);
  }, []);

  /**
   * Get role level for comparison
   */
  const getRoleLevel = useCallback((role) => {
    return permissionsService.getRoleLevel(role);
  }, []);

  return {
    permissions,
    roles,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    getModulePermissions,
    hasRole,
    refreshPermissions,
    clearPermissions,
    initializePermissions,
    canEditUser,
    canEditPrimaryRole,
    getAssignableRoles,
    getRoleLevel,
  };
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermissions(
  WrappedComponent,
  requiredModule,
  requiredAction
) {
  return function PermissionWrappedComponent(props) {
    const { hasPermission, loading } = usePermissions();

    if (loading) {
      return <div>Loading permissions...</div>;
    }

    if (!hasPermission(requiredModule, requiredAction)) {
      return <div>Access denied. Insufficient permissions.</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Component for conditional rendering based on permissions
 */
export function PermissionGate({
  module,
  action,
  role,
  fallback = null,
  children,
}) {
  const { hasPermission, hasRole, loading } = usePermissions();

  if (loading) {
    return fallback;
  }

  // Check role-based access
  if (role && !hasRole(role)) {
    return fallback;
  }

  // Check permission-based access
  if (module && action && !hasPermission(module, action)) {
    return fallback;
  }

  // Check if user has any permission in module
  if (module && !action && !hasAnyPermission(module)) {
    return fallback;
  }

  return children;
}

export default usePermissions;
