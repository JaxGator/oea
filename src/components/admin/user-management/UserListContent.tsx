import { memo } from "react";
import { Member } from "@/components/members/types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminUserTableRow } from "./AdminUserTableRow";
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
      <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:px-0">
        <AdminUserTableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] sm:w-[300px]">User</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
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
                  isUpdating={false}
                />
              ))}
            </TableBody>
          </Table>
        </AdminUserTableWrapper>
      </div>

      {totalPages > 1 && (
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