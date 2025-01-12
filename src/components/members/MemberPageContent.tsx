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

export function MemberPageContent({ members, currentUserIsAdmin, isMobile }: MemberPageContentProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  console.log('MemberPageContent - Render:', {
    memberCount: members.length,
    currentUserIsAdmin,
    isMobile,
    selectedMember
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
          Total Members: <span className="font-medium">{members.length}</span>
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
              members={members}
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