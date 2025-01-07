import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminUserActionsProps {
  profile: {
    id: string;
    username: string;
    is_admin: boolean;
  };
  onUpdateStatus: (username: string) => void;
  onEdit: () => void;
  isUpdating: boolean;
}

export function AdminUserActions({ 
  profile, 
  onUpdateStatus, 
  onEdit,
  isUpdating 
}: AdminUserActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="w-full sm:w-auto"
              aria-label="Edit user details"
            >
              Edit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modify user details including name, permissions, and status</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!profile.is_admin && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(profile.username)}
                disabled={isUpdating}
                className="w-full sm:w-auto whitespace-nowrap"
                aria-label="Make user an admin"
              >
                <Shield className="h-4 w-4 mr-1" aria-hidden="true" />
                Make Admin
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grant administrative privileges to this user, allowing them to manage the site</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}