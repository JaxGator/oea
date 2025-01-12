import { useState, useCallback } from "react";
import { Member } from "./types";
import { MemberList } from "./MemberList";
import { EditMemberDialog } from "./EditMemberDialog";
import { ViewMemberDialog } from "./ViewMemberDialog";
import { Users } from "lucide-react";
import { LeaderboardPage } from "./leaderboard/LeaderboardPage";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { MemberPageError } from "./MemberPageError";
import { useToast } from "@/hooks/use-toast";

interface MemberPageContentProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

interface Filters {
  isAdmin: boolean;
  isApproved: boolean;
  isMember: boolean;
}

export function MemberPageContent({ members, currentUserIsAdmin, isMobile }: MemberPageContentProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    isAdmin: false,
    isApproved: false,
    isMember: false
  });
  const { toast } = useToast();

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const filteredMembers = members.filter(member => {
    // If no filters are active, show all members
    if (!filters.isAdmin && !filters.isApproved && !filters.isMember) {
      return true;
    }

    return (
      (filters.isAdmin && member.is_admin) ||
      (filters.isApproved && member.is_approved) ||
      (filters.isMember && member.is_member)
    );
  });

  const handleViewMember = useCallback((member: Member) => {
    if (!member?.id) {
      console.error('Invalid member data:', member);
      toast({
        title: "Error",
        description: "Could not view member details. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  }, [toast]);

  const handleEditMember = useCallback((member: Member) => {
    if (!member?.id) {
      console.error('Invalid member data:', member);
      toast({
        title: "Error",
        description: "Could not edit member details. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  }, [toast]);

  const handleMemberUpdate = useCallback(() => {
    console.log('Member updated, refreshing data...');
    toast({
      title: "Success",
      description: "Member details updated successfully.",
    });
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Members Directory</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Members: <span className="font-medium">{filteredMembers.length}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isAdmin}
              onChange={() => handleFilterChange({ ...filters, isAdmin: !filters.isAdmin })}
              className="form-checkbox"
            />
            <span>Admins</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isApproved}
              onChange={() => handleFilterChange({ ...filters, isApproved: !filters.isApproved })}
              className="form-checkbox"
            />
            <span>Approved</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isMember}
              onChange={() => handleFilterChange({ ...filters, isMember: !filters.isMember })}
              className="form-checkbox"
            />
            <span>Members</span>
          </label>
        </div>
      </div>

      <ErrorBoundary
        fallback={MemberPageError}
        onError={(error) => {
          console.error('Members page error:', error);
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MemberList
              members={filteredMembers}
              currentUserIsAdmin={currentUserIsAdmin}
              onViewMember={handleViewMember}
              onEditMember={handleEditMember}
              isMobile={isMobile}
            />
          </div>
          
          <div>
            <LeaderboardPage />
          </div>
        </div>

        {selectedMember && (
          <>
            <ViewMemberDialog
              member={selectedMember}
              open={isViewDialogOpen}
              onOpenChange={setIsViewDialogOpen}
            />
            
            {currentUserIsAdmin && (
              <EditMemberDialog
                member={selectedMember}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onUpdate={handleMemberUpdate}
              />
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}