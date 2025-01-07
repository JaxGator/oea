import { Shield, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { AdminDropdownMenu } from "./user-management/shared/AdminDropdownMenu";
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
    console.log('AdminUserActions: Edit clicked for profile:', profile);
    onEdit();
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

  const dropdownActions = [
    {
      label: "Edit",
      icon: <Edit2 className="mr-2 h-4 w-4" />,
      onClick: handleEdit
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: () => setShowDeleteDialog(true),
      className: "text-red-600"
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <AdminDropdownMenu actions={dropdownActions} />

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