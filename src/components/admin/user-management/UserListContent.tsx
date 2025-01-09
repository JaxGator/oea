import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./AdminUserTableWrapper";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export function UserListContent({
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
    console.error('Error loading members:', error);
    return <ErrorState message="Error loading members. Please try refreshing the page." />;
  }

  if (!Array.isArray(members)) {
    console.error('Members is not an array:', members);
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}