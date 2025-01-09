import { memo } from "react";
import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./AdminUserTableWrapper";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { UserListPagination } from "./UserListPagination";

interface UserListContentProps {
  members: Member[];
  isLoading: boolean;
  error: Error | null;
  onEditMember: (member: Member) => void;
  onDeleteMember: (userId: string) => void;
  onViewMember: (member: Member) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const UserListContent = memo(function UserListContent({
  members,
  isLoading,
  error,
  onEditMember,
  onDeleteMember,
  onViewMember,
  currentPage,
  totalPages,
  onPageChange,
}: UserListContentProps) {
  if (isLoading) return <LoadingState />;
  
  if (error) {
    return <ErrorState message="Error loading members. Please try refreshing the page." />;
  }

  if (!Array.isArray(members)) {
    return <ErrorState message="Invalid data format. Please try refreshing the page." />;
  }

  return (
    <div className="space-y-4">
      <AdminUserTableWrapper>
        <MemberTable 
          members={members} 
          currentUserIsAdmin={true} 
          onViewMember={onViewMember}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
        />
      </AdminUserTableWrapper>

      {totalPages > 1 && (
        <UserListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});