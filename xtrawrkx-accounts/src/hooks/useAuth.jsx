import { useState, useEffect, createContext, useContext } from "react";
import { getCurrentUserToken, signOutUser } from "../lib/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const currentToken = getCurrentUserToken();
      if (currentToken) {
        return currentToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
