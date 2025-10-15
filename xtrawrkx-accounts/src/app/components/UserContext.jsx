"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;

    // Define detailed permissions for each module/feature
    const modulePermissions = {
      dashboard: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      users: [
        "Super Administrator",
        "Administrator",
        "Super Admin",
        "Manager",
        "Sales Manager",
        "Project Manager",
      ],
      permissions: ["Super Administrator", "Administrator", "Super Admin"],
      teams: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
      ],
      leads: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      accounts: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      projects: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      tasks: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      reports: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
        "Read-only User",
      ],
      imports: [
        "Super Administrator",
        "Administrator",
        "Manager",
        "Sales Manager",
        "Finance Manager",
      ],
      auditLogs: ["Super Administrator", "Administrator", "Super Admin"],
      settings: [
        "Super Administrator",
        "Administrator",
        "Super Admin",
        "Manager",
        "Sales Manager",
        "Project Manager",
        "Finance Manager",
      ],
      profile: [
        "Super Administrator",
        "Administrator",
        "Super Admin",
        "Manager",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Finance Manager",
        "Developer",
      ],
    };

    // Get current user's role display name
    const userRoleDisplayName = getRoleDisplayName();

    // Check if user has permission for the requested module
    const allowedRoles = modulePermissions[permission] || [];
    return allowedRoles.includes(userRoleDisplayName);
  };

  const getVisibilityLevel = () => {
    if (!currentUser) return "none";

    const visibilityLevels = {
      super_admin: "organization",
      admin: "organization",
      manager: "team",
      sales_manager: "team",
      project_manager: "team",
      finance: "team",
      sales_rep: "private",
      account_manager: "private",
      developer: "private",
      read_only: "private",
    };

    return visibilityLevels[currentUser.role] || "private";
  };

  const getRoleDisplayName = () => {
    if (!currentUser) return "";

    const roleNames = {
      super_admin: "Super Administrator",
      admin: "Administrator",
      manager: "Manager",
      sales_manager: "Sales Manager",
      sales_rep: "Sales Representative",
      account_manager: "Account Manager",
      project_manager: "Project Manager",
      finance: "Finance Manager",
      developer: "Developer",
      read_only: "Read-only User",
    };

    // Handle direct role names from backend (fallback)
    if (currentUser.role === "Super Admin") {
      return "Super Admin";
    }

    return roleNames[currentUser.role] || currentUser.role;
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    hasPermission,
    getVisibilityLevel,
    getRoleDisplayName,
    isAuthenticated: !!currentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
