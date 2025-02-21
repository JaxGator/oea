import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserFilters } from "@/components/admin/user-management/UserFilters";
import { AdminUserTableWrapper } from "@/components/admin/user-management/AdminUserTableWrapper";
import { UserListContainer } from "@/components/admin/user-management/UserListContainer";
import { AdminUserActions } from "./AdminUserActions";
import { UserListHeader } from "@/components/admin/user-management/UserListHeader";
import { useUserList } from "@/hooks/admin/useUserList";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminUserList() {
  const { filters, setFilters, searchTerm, setSearchTerm, filteredUsers, isLoading } = useUserList();
	const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleExportUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-users`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export users');
      }

      // Get the CSV content
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Users exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export users",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <Button 
          onClick={handleExportUsers}
          className="flex items-center gap-2"
          variant="secondary"
        >
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>
      
      <UserListHeader
        onSearch={setSearchTerm}
        filters={filters}
        onFilterChange={setFilters}
        onUserCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          navigate(0);
        }}
      />

      <UserListContainer>
        <AdminUserTableWrapper
          users={filteredUsers}
          isLoading={isLoading}
        />
      </UserListContainer>
    </div>
  );
}
