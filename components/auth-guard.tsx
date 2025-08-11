"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const isAuth = localStorage.getItem("isAuthenticated") === "true";

      console.log("AuthGuard checkAuth:", {
        token: !!token,
        isAuth,
        isAuthenticated,
      });

      if (!token || !isAuth) {
        console.log(
          "AuthGuard: No token or not authenticated, redirecting to login"
        );
        router.push("/auth/login");
        return;
      }

      console.log("AuthGuard: Authentication successful");
      setIsLoading(false);
    };

    checkAuth();
  }, [router, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
