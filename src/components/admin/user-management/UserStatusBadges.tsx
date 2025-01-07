import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, UserCheck, Users } from "lucide-react";

interface UserStatusBadgesProps {
  isAdmin: boolean;
  isApproved: boolean;
  isMember: boolean;
}

export function UserStatusBadges({ isAdmin, isApproved, isMember }: UserStatusBadgesProps) {
  return (
    <TooltipProvider>
      {isAdmin && (
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
      {isApproved && (
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
      {isMember && (
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