import { Shield, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { useState } from "react";
import { Member } from "../members/types";

interface AdminUserActionsProps {
  profile: Member;
  onUpdateStatus: (username: string) => void;
  onEdit: (member: Member) => void;
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
    console.log('AdminUserActions: Edit clicked for profile:', profile);
    onEdit(profile);
  };

  const handleUpdateStatus = () => {
    console.log('AdminUserActions: Update status clicked for username:', profile.username);
    onUpdateStatus(profile.username);
  };

  const handleDelete = () => {
    console.log('AdminUserActions: Delete confirmed for profile:', profile);
    onDelete(profile.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className="whitespace-nowrap"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="whitespace-nowrap text-red-600"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

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