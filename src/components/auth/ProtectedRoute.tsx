import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuthState();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}