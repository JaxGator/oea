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

  // Add console logs for debugging
  console.log("RequireAdmin - Profile:", profile);
  console.log("RequireAdmin - Is Loading:", isLoading);
  console.log("RequireAdmin - Error:", error);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to verify admin status. Please try again.",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!profile?.is_admin) {
    toast({
      title: "Access Denied",
      description: "You do not have admin privileges.",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}