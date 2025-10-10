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
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Marketing Specialist",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      users: ["Super Administrator", "Administrator"],
      permissions: ["Super Administrator", "Administrator"],
      teams: ["Super Administrator", "Administrator", "Sales Manager"],
      leads: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Marketing Specialist",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      accounts: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Marketing Specialist",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      projects: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      tasks: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Marketing Specialist",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      reports: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Sales Representative",
        "Account Manager",
        "Marketing Specialist",
        "Project Manager",
        "Support Agent",
        "Finance Manager",
        "Read-only User",
      ],
      imports: [
        "Super Administrator",
        "Administrator",
        "Sales Manager",
        "Marketing Specialist",
        "Finance Manager",
      ],
      auditLogs: ["Super Administrator", "Administrator"],
      settings: ["Super Administrator", "Administrator"],
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
      sales_manager: "team",
      project_manager: "team",
      marketing: "team",
      finance: "team",
      sales_rep: "private",
      account_manager: "private",
      support: "private",
      read_only: "private",
    };

    return visibilityLevels[currentUser.role] || "private";
  };

  const getRoleDisplayName = () => {
    if (!currentUser) return "";

    const roleNames = {
      super_admin: "Super Administrator",
      admin: "Administrator",
      sales_manager: "Sales Manager",
      sales_rep: "Sales Representative",
      account_manager: "Account Manager",
      marketing: "Marketing Specialist",
      project_manager: "Project Manager",
      support: "Support Agent",
      finance: "Finance Manager",
      read_only: "Read-only User",
    };

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
