import { Button } from "@/components/ui/button";
import { Shield, MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { useState } from "react";

interface AdminUserActionsProps {
  profile: {
    id: string;
    username: string;
    is_admin: boolean;
  };
  onUpdateStatus: (username: string) => void;
  onEdit: () => void;
  onDelete: (userId: string) => void;
  isUpdating: boolean;
}

export function AdminUserActions({ 
  profile, 
  onUpdateStatus, 
  onEdit,
  onDelete,
  isUpdating 
}: AdminUserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleUpdateStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateStatus(profile.username);
  };

  const handleDelete = () => {
    onDelete(profile.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open menu"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!profile.is_admin && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateStatus}
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

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        username={profile.username}
      />
    </div>
  );
}