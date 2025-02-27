
import { useAdminCheck } from "@/hooks/auth/useAdminCheck";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdmin, isLoading, error, profile } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      console.error('Admin access denied:', {
        hasProfile: !!profile,
        isAdmin,
        userId: profile?.id,
        error,
        timestamp: new Date().toISOString()
      });

      toast.error("You must be an admin to access this area");
      
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate, profile, error]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAdmin ? <>{children}</> : null;
}
