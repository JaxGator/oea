import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberList } from "./MemberList";
import { MemberTable } from "./MemberTable";
import { Users } from "lucide-react";
import { useState } from "react";
import { ViewMemberDialog } from "./ViewMemberDialog";
import { Member } from "./types";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

interface MemberPageContentProps {
  members: any[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberPageContent({ members, currentUserIsAdmin, isMobile }: MemberPageContentProps) {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-8 text-gray-500">
          An error occurred while displaying members. Please try refreshing the page.
        </div>
      }
    >
      <div className="min-h-screen bg-[#222222] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6" aria-hidden="true" />
              <h1 className="text-2xl font-bold" id="members-heading">Member Directory</h1>
            </div>
            
            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-500" role="status">
                No members found.
              </div>
            ) : (
              <div role="region" aria-labelledby="members-heading">
                {isMobile ? (
                  <MemberList 
                    members={members}
                    currentUserIsAdmin={currentUserIsAdmin}
                    isMobile={isMobile}
                  />
                ) : (
                  <ScrollArea className="rounded-md border">
                    <MemberTable 
                      members={members}
                      currentUserIsAdmin={currentUserIsAdmin}
                      onViewMember={setViewingMember}
                      onEditMember={handleEditMember}
                    />
                  </ScrollArea>
                )}
              </div>
            )}
          </div>
        </div>

        <ViewMemberDialog
          member={viewingMember}
          open={!!viewingMember}
          onOpenChange={(open) => !open && setViewingMember(null)}
        />
      </div>
    </ErrorBoundary>
  );
}