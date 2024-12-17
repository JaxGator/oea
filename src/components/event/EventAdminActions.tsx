import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { DeleteEventDialog } from "./DeleteEventDialog";

interface EventAdminActionsProps {
  isAdmin: boolean;
  showDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventAdminActions({ isAdmin, showDelete, onEdit, onDelete }: EventAdminActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isAdmin && !showDelete) return null;

  return (
    <>
      {isAdmin && (
        <Button
          onClick={onEdit}
          variant="outline"
          className="px-3"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
      {showDelete && (
        <>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="px-3"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
          <DeleteEventDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onDelete={onDelete}
          />
        </>
      )}
    </>
  );
}