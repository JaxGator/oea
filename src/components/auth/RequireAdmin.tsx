import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { profile, isLoading } = useAuthState();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}