import { Badge } from "@/components/ui/badge";
import { AdminUserActions } from "../AdminUserActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, UserCheck, Users } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
}

interface AdminUserTableRowProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  onUpdateStatus: (username: string) => void;
  isUpdating: boolean;
}

export function AdminUserTableRow({
  profile,
  onEdit,
  onUpdateStatus,
  isUpdating
}: AdminUserTableRowProps) {
  if (!profile || !profile.username) {
    return null; // Don't render if profile or username is missing
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{profile.username}</span>
          <span className="text-sm text-gray-500">{profile.full_name || '-'}</span>
          <div className="flex flex-wrap gap-1 md:hidden mt-2">
            <StatusBadges profile={profile} />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          <StatusBadges profile={profile} />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdminUserActions
            profile={profile}
            onUpdateStatus={onUpdateStatus}
            isUpdating={isUpdating}
            onEdit={() => onEdit(profile)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

function StatusBadges({ profile }: { profile: Profile }) {
  return (
    <TooltipProvider>
      {profile.is_admin && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="default" 
              className="bg-red-500"
              role="status"
              aria-label="User has admin status"
            >
              <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
              Admin
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>User has administrative privileges</p>
          </TooltipContent>
        </Tooltip>
      )}
      {profile.is_approved && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="default" 
              className="bg-green-500"
              role="status"
              aria-label="User is approved"
            >
              <UserCheck className="h-3 w-3 mr-1" aria-hidden="true" />
              Approved
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>User has been approved by an admin</p>
          </TooltipContent>
        </Tooltip>
      )}
      {profile.is_member && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="default" 
              className="bg-blue-500"
              role="status"
              aria-label="User is a member"
            >
              <Users className="h-3 w-3 mr-1" aria-hidden="true" />
              Member
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>User is a confirmed member</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
}