import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { useAuthState } from "@/hooks/useAuthState";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { profile } = useAuthState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-admin users
  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <AdminUserList />
        </div>
      </div>
    </div>
  );
}