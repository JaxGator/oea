
import { useAdminCheck } from "@/hooks/auth/useAdminCheck";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page.");
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
