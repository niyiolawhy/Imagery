"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { clearTokens, setToken } from "@/services/axios-instance";

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthStatus = (): boolean => {
    const token = localStorage.getItem("token");
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (token && isAuth && userEmail) {
      if (!user || !isAuthenticated) {
        setUser({
          email: userEmail,
          name: userName || "User",
        });
        setIsAuthenticated(true);
      }
      return true;
    }

    if (user || isAuthenticated) {
      setUser(null);
      setIsAuthenticated(false);
    }

    return false;
  };

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();

    // Set up periodic auth check every 5 minutes
    intervalRef.current = setInterval(() => {
      checkAuthStatus();
    }, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const updateTokens = (token: string, refreshToken: string) => {
    setToken(token, refreshToken);
  };

  const login = (email: string, password: string, name?: string) => {
    // Simple validation (in a real app, this would be server-side)
    if (email && password) {
      const userData = {
        email,
        name: name || email.split("@")[0],
      }

      setUser(userData)
      setIsAuthenticated(true)

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", userData.name)

      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    clearTokens();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateTokens,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
