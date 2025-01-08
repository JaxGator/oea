import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
}

export function UserAvatar({ username, avatarUrl }: UserAvatarProps) {
  return avatarUrl ? (
    <div className="flex justify-center mb-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>
          <UserCircle className="h-20 w-20" />
        </AvatarFallback>
      </Avatar>
    </div>
  ) : null;
}