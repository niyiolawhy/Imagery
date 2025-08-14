"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, LogIn } from "lucide-react";

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { logout, checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      console.log('Auth error boundary received:', event.detail);
      setErrorMessage(event.detail.message || 'Authentication failed');
      setHasError(true);
    };

    window.addEventListener('auth:error', handleAuthError as EventListener);

    return () => {
      window.removeEventListener('auth:error', handleAuthError as EventListener);
    };
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage("");
    checkAuthStatus();
  };

  const handleLogin = () => {
    logout();
    router.push('/auth/login');
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'Your session has expired. Please log in again.'}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRetry} 
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleLogin} 
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
