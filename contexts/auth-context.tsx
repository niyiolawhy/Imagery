"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, name?: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on app start
    const authStatus = localStorage.getItem("isAuthenticated")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")

    if (authStatus === "true" && userEmail) {
      setUser({
        email: userEmail,
        name: userName || "User",
      })
      setIsAuthenticated(true)
    }
  }, [])

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

    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
