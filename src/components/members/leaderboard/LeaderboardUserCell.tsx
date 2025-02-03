import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Member } from "../types";

interface LeaderboardUserCellProps {
  user: Member;
}

export function LeaderboardUserCell({ user }: LeaderboardUserCellProps) {
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage 
          src={user.avatar_url || ''} 
          alt={`${user.username}'s profile picture`}
        />
        <AvatarFallback>
          <UserCircle className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium truncate">{user.username}</div>
        {user.full_name && (
          <div className="text-sm text-gray-500 truncate">{user.full_name}</div>
        )}
      </div>
    </div>
  );
}