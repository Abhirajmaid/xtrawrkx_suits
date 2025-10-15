"use client";

import RouteGuard from "./RouteGuard";

/**
 * Higher-Order Component for Route Protection
 * Wraps pages with route protection based on roles and permissions
 */

// Route protection configurations
const ROUTE_CONFIGS = {
  // Admin-only routes (Manager level and above)
  "/users": { requiredLevel: "Manager" },
  "/users/new": { requiredLevel: "Manager" },
  "/users/roles": { requiredLevel: "Manager" },
  "/organization": { requiredLevel: "Manager" },
  "/organization/departments": { requiredLevel: "Manager" },
  "/settings": { requiredLevel: "Manager" },
  "/settings/general": { requiredLevel: "Manager" },
  "/settings/notifications": { requiredLevel: "Manager" },
  "/settings/integrations": { requiredLevel: "Manager" },

  // Super Admin only routes
  "/settings/advanced": { requiredRole: "Super Admin" },
  "/system": { requiredRole: "Super Admin" },

  // Public routes (all authenticated users)
  "/": { requiredLevel: "Read-only User" }, // Minimum level
  "/profile": { requiredLevel: "Read-only User" },
  "/activity": { requiredLevel: "Read-only User" },
};

/**
 * HOC to wrap components with route protection
 */
export function withRouteProtection(WrappedComponent, customConfig = {}) {
  return function ProtectedComponent(props) {
    return (
      <RouteGuard {...customConfig}>
        <WrappedComponent {...props} />
      </RouteGuard>
    );
  };
}

/**
 * Get route configuration for a given pathname
 */
export function getRouteConfig(pathname) {
  // Find exact match first
  if (ROUTE_CONFIGS[pathname]) {
    return ROUTE_CONFIGS[pathname];
  }

  // Find prefix match
  for (const [route, config] of Object.entries(ROUTE_CONFIGS)) {
    if (pathname.startsWith(route)) {
      return config;
    }
  }

  // Default: require authentication but no specific role
  return { requiredLevel: "Read-only User" };
}

/**
 * Check if user has access to a specific route
 */
export function hasRouteAccess(pathname, userRole) {
  const config = getRouteConfig(pathname);

  if (!userRole) return false;

  // Check required role
  if (config.requiredRole) {
    return userRole === config.requiredRole;
  }

  // Check required level
  if (config.requiredLevel) {
    const userLevel = getRoleLevel(userRole);
    const requiredLevel = getRoleLevel(config.requiredLevel);
    return userLevel >= requiredLevel;
  }

  return true;
}

/**
 * Get role level for comparison
 */
function getRoleLevel(role) {
  const hierarchy = {
    "Super Admin": 20,
    Admin: 15,
    Manager: 10,
    "Sales Manager": 10,
    "Project Manager": 9,
    "Finance Manager": 8,
    "Account Manager": 6,
    "Sales Representative": 5,
    Developer: 2,
    "Read-only User": 1,
  };

  return hierarchy[role] || 0;
}

/**
 * Hook to check route access
 */
export function useRouteAccess(pathname) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        const access = hasRouteAccess(pathname, user.role);
        setHasAccess(access);
      }
    } catch (error) {
      console.error("Error checking route access:", error);
      setHasAccess(false);
    } finally {
      setIsChecking(false);
    }
  }, [pathname]);

  return { hasAccess, isChecking };
}

