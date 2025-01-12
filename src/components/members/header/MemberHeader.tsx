import { Users } from "lucide-react";

interface MemberHeaderProps {
  totalMembers: number;
}

export function MemberHeader({ totalMembers }: MemberHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Members Directory</h2>
      </div>
      <div className="text-sm text-muted-foreground">
        Total Members: <span className="font-medium">{totalMembers}</span>
      </div>
    </div>
  );
}