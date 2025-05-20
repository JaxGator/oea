
import { memo } from "react";
import { Member } from "@/components/members/types";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { AdminUserTableRow } from "./AdminUserTableRow";
import { AdminUserTableWrapper } from "./AdminUserTableWrapper";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { UserListPagination } from "./UserListPagination";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isUpdatingUser?: boolean;
}

export const UserListContent = memo(function UserListContent({
  members = [], // Provide default empty array to prevent null/undefined errors
  isLoading,
  error,
  onEditMember,
  onDeleteMember,
  onViewMember,
  currentPage,
  totalPages,
  onPageChange,
  isUpdatingUser = false,
}: UserListContentProps) {
  const isMobile = useIsMobile();

  if (isLoading) return <LoadingState />;
  
  if (error) {
    console.error('UserListContent error:', error);
    return <ErrorState message="Error loading members. Please try refreshing the page." />;
  }

  // Add extra safety check for members data
  if (!Array.isArray(members)) {
    console.error('UserListContent: Invalid members data:', members);
    return <ErrorState message="Invalid data format. Please try refreshing the page." />;
  }

  return (
    <div className="space-y-4">
      <AdminUserTableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sm:w-[250px]">User</TableHead>
              {!isMobile && <TableHead>Status</TableHead>}
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <AdminUserTableRow
                key={member.id}
                profile={member}
                onEdit={onEditMember}
                onUpdateStatus={() => {}}
                onDelete={onDeleteMember}
                isUpdating={isUpdatingUser}
                isMobile={isMobile}
              />
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={isMobile ? 2 : 3} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </AdminUserTableWrapper>

      {totalPages > 0 && (
        <div className="flex justify-center mt-4">
          <UserListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
});
