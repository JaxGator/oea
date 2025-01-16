import { useState, useCallback } from "react";
import { Member } from "./types";
import { MemberList } from "./MemberList";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { MemberPageError } from "./MemberPageError";
import { useToast } from "@/hooks/use-toast";
import { MemberFilters } from "./filters/MemberFilters";
import { MemberHeader } from "./header/MemberHeader";
import { MemberDialogManager } from "./dialogs/MemberDialogManager";

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

export function MemberPageContent({ 
  members, 
  currentUserIsAdmin, 
  isMobile 
}: MemberPageContentProps) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <MemberHeader totalMembers={filteredMembers.length} />
          <MemberFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <ErrorBoundary
        fallback={MemberPageError}
        onError={(error) => {
          console.error('Members page error:', error);
        }}
      >
        <MemberList
          members={filteredMembers}
          currentUserIsAdmin={currentUserIsAdmin}
          onViewMember={handleViewMember}
          onEditMember={handleEditMember}
          isMobile={isMobile}
        />

        <MemberDialogManager
          selectedMember={selectedMember}
          isEditDialogOpen={isEditDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          currentUserIsAdmin={currentUserIsAdmin}
          onEditDialogChange={setIsEditDialogOpen}
          onViewDialogChange={setIsViewDialogOpen}
        />
      </ErrorBoundary>
    </div>
  );
}