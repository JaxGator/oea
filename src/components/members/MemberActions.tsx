import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthState } from "@/hooks/useAuthState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MemberActionButton } from "./actions/MemberActionButton";
import { MemberActionMenu } from "./actions/MemberActionMenu";

interface MemberActionsProps {
  memberId: string;
  memberName: string;
  isCurrentUserAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function MemberActions({
  memberId,
  memberName,
  isCurrentUserAdmin,
  onEdit,
  onDelete,
}: MemberActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuthState();

  if (!user) return null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MemberActionButton />
        </DropdownMenuTrigger>
        {isCurrentUserAdmin && (
          <MemberActionMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}