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
  isUpdating: boolean;
}

export function AdminUserActions({ profile, onUpdateStatus, isUpdating }: AdminUserActionsProps) {
  return (
    <div className="flex items-center">
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
              >
                <Shield className="h-4 w-4 mr-1" />
                Make Admin
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grant admin privileges to this user</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}