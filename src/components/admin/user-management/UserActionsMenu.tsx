import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, UserCheck } from "lucide-react";

interface UserActionsMenuProps {
  onEdit: () => void;
  onUpdateStatus: () => void;
  isUpdating: boolean;
}

export function UserActionsMenu({ onEdit, onUpdateStatus, isUpdating }: UserActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-gray-200"
          aria-label="Open menu"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[160px] bg-white shadow-lg border border-gray-200 rounded-md z-50"
      >
        <DropdownMenuItem 
          onClick={onEdit}
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onUpdateStatus}
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          disabled={isUpdating}
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Update Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}