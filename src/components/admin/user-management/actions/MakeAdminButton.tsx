import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MakeAdminButtonProps {
  onUpdateStatus: () => void;
  isUpdating: boolean;
}

export function MakeAdminButton({ onUpdateStatus, isUpdating }: MakeAdminButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdateStatus}
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
  );
}