import { useState } from "react";
import { Member } from "./types";
import { MemberList } from "./MemberList";
import { EditMemberDialog } from "./EditMemberDialog";
import { ViewMemberDialog } from "./ViewMemberDialog";

interface MemberPageContentProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberPageContent({ members, currentUserIsAdmin, isMobile }: MemberPageContentProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  console.log('MemberPageContent - Render:', {
    memberCount: members.length,
    currentUserIsAdmin,
    isMobile,
    selectedMember
  });

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MemberList
        members={members}
        currentUserIsAdmin={currentUserIsAdmin}
        onViewMember={handleViewMember}
        onEditMember={handleEditMember}
      />

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
            />
          )}
        </>
      )}
    </div>
  );
}