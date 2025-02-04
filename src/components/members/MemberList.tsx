import { Member } from "./types";
import { MemberListContainer } from "./list/MemberListContainer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberListProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  isMobile: boolean;
}

export function MemberList({ 
  members, 
  currentUserIsAdmin, 
  onViewMember, 
  onEditMember,
  isMobile 
}: MemberListProps) {
  if (!members) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No members found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <MemberListContainer
      members={members}
      currentUserIsAdmin={currentUserIsAdmin}
      onViewMember={onViewMember}
      onEditMember={onEditMember}
      isMobile={isMobile}
    />
  );
}