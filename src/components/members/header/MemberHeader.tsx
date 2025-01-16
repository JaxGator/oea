import { Users } from "lucide-react";

interface MemberHeaderProps {
  totalMembers: number;
}

export function MemberHeader({ totalMembers }: MemberHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Users className="h-6 w-6" />
      <h2 className="text-2xl font-semibold">User Directory</h2>
      <span className="text-sm text-muted-foreground ml-2">
        ({totalMembers} users)
      </span>
    </div>
  );
}