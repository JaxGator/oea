import { Navigate, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAdminCheck } from "@/hooks/auth/useAdminCheck";
import { toast } from "@/hooks/use-toast";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdmin, isLoading, profile } = useAdminCheck();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    console.log("RequireAdmin - No profile found, redirecting to auth");
    toast({
      title: "Authentication Required",
      description: "Please sign in to continue",
      variant: "destructive",
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log("RequireAdmin - User is not an admin, redirecting to home");
    toast({
      title: "Access Denied",
      description: "Admin access required",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}