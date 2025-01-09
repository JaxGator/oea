import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { profile, isLoading, error } = useAuthState();
  const location = useLocation();

  // Add debug logs
  console.log("RequireAdmin - Current state:", {
    profile,
    isLoading,
    error,
    pathname: location.pathname
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error("RequireAdmin - Auth error:", error);
    toast({
      title: "Authentication Error",
      description: "Please try signing in again",
      variant: "destructive",
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has a profile and is an admin
  if (!profile) {
    console.log("RequireAdmin - No profile found, redirecting to auth");
    toast({
      title: "Access Denied",
      description: "Please sign in to continue",
      variant: "destructive",
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!profile.is_admin) {
    console.log("RequireAdmin - User is not an admin, redirecting to home");
    toast({
      title: "Access Denied",
      description: "You do not have admin privileges",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}