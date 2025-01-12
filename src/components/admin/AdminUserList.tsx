import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";

export interface UserFilters {
  isAdmin: boolean;
  isApproved: boolean;
  isMember: boolean;
}

export function AdminUserList() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    isAdmin: false,
    isApproved: false,
    isMember: false,
  });
  const { toast } = useToast();

  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['members', searchTerm, filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('username', `%${searchTerm}%`);
      }

      if (filters.isAdmin) {
        query = query.eq('is_admin', true);
      }
      if (filters.isApproved) {
        query = query.eq('is_approved', true);
      }
      if (filters.isMember) {
        query = query.eq('is_member', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the data (renamed from cacheTime)
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleEditMember = useCallback((member: Member) => {
    console.log('AdminUserList: Setting selected member for edit:', member);
    setSelectedMember(member);
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-user-management', {
        body: { action: 'delete', userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  }, [refetch, toast]);

  const handleUpdateStatus = useCallback(async (username: string) => {
    console.log('Update status for:', username);
    // Status update logic will be implemented later
  }, []);

  const handleUpdateComplete = useCallback(async () => {
    console.log('AdminUserList: Update completed, refreshing data');
    await refetch();
    setSelectedMember(null);
  }, [refetch]);

  const totalPages = Math.ceil((members?.length || 0) / 10);

  return (
    <div className="space-y-6">
      <UserListHeader
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onUserCreated={refetch}
      />

      <UserListContent
        members={members}
        isLoading={isLoading}
        error={error as Error}
        onEditMember={handleEditMember}
        onDeleteMember={setUserToDelete}
        onViewMember={handleEditMember}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedMember && (
        <EditMemberHandler
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={handleUpdateComplete}
        />
      )}

      {userToDelete && (
        <DeleteUserDialog
          open={true}
          onOpenChange={(open) => !open && setUserToDelete(null)}
          onConfirm={() => handleDeleteUser(userToDelete)}
          username={members.find(m => m.id === userToDelete)?.username || 'Unknown User'}
        />
      )}
    </div>
  );
}