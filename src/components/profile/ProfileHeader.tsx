import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl: string;
  fullName: string;
  username: string;
}

export function ProfileHeader({ avatarUrl, fullName, username }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt={fullName || username} />
        <AvatarFallback>
          <UserCircle className="h-20 w-20 text-[#0d97d1]" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">{fullName || username}</p>
      </div>
    </div>
  );
}