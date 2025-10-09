import { useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChange,
  getCurrentUserToken,
  refreshUserToken,
  signOutUser,
} from "../lib/auth";

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
  const [firebaseUser, setFirebaseUser] = useState(null);
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

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get fresh token and sync with backend
          const result = await refreshUserToken();
          if (result) {
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userData", JSON.stringify(result.user));
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
          // If sync fails, clear local data
          setUser(null);
          setToken(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      } else {
        // User signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }

      setLoading(false);
    });

    return () => unsubscribe();
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
      setFirebaseUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const result = await refreshUserToken();
      if (result) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        return result.token;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  };

  const value = {
    user,
    firebaseUser,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isFirebaseAuthenticated: !!firebaseUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
