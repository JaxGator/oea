import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";

interface AdminActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  isWixEvent?: boolean;
}

export function AdminActions({ onEdit, onDelete, showDelete, isWixEvent }: AdminActionsProps) {
  return (
    <>
      {!isWixEvent && (
        <Button
          variant="outline"
          onClick={onEdit}
          className="ml-auto"
        >
          <Edit2Icon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}

      {showDelete && (
        <Button
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2Icon className="w-4 h-4 mr-2" />
          Delete
        </Button>
      )}
    </>
  );
}