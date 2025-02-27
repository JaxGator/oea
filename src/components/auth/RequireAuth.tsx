
import { ReactNode, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/auth/useSession";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
}

// Loading component with timeout to prevent flashing
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading">
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">Loading authentication status...</span>
  </div>
);

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useSession();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
}
