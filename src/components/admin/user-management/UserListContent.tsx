import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./AdminUserTableWrapper";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

interface UserListContentProps {
  members: Member[] | null;
  isLoading: boolean;
  error: Error | null;
  onEditMember: (member: Member) => void;
  onDeleteMember: (userId: string) => void;
}

export function UserListContent({
  members,
  isLoading,
  error,
  onEditMember,
  onDeleteMember,
}: UserListContentProps) {
  if (isLoading) return <LoadingState />;
  
  if (error) {
    console.error('Error loading members:', error);
    return <ErrorState message="Error loading members. Please try refreshing the page." />;
  }

  if (!Array.isArray(members)) {
    console.error('Members is not an array:', members);
    return <ErrorState message="Invalid data format. Please try refreshing the page." />;
  }

  return (
    <AdminUserTableWrapper>
      <MemberTable 
        members={members} 
        currentUserIsAdmin={true} 
        onViewMember={() => {}}
        onEditMember={onEditMember}
        onDeleteMember={onDeleteMember}
      />
    </AdminUserTableWrapper>
  );
}