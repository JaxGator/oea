import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserList } from "@/components/admin/AdminUserList";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#222222] py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
            <AdminUserList />
          </div>
        </div>
      </div>
    </div>
  );
}