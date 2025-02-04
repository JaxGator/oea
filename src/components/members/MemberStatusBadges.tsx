interface MemberStatusBadgesProps {
  isAdmin: boolean;
  isApproved: boolean;
  isMember: boolean;
}

export function MemberStatusBadges({ isAdmin, isApproved, isMember }: MemberStatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isAdmin && (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
          Admin
        </span>
      )}
      {isApproved && (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      )}
      {isMember && (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          Member
        </span>
      )}
    </div>
  );
}