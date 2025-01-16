import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface LeaderboardUserCellProps {
  avatarUrl?: string;
  username: string;
  fullName?: string;
}

export function LeaderboardUserCell({ avatarUrl, username, fullName }: LeaderboardUserCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>
          <UserCircle className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{username || 'Unknown User'}</div>
        {fullName && <div className="text-sm text-gray-500">{fullName}</div>}
      </div>
    </div>
  );
}