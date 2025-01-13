import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon, Eye, EyeOff } from "lucide-react";

interface AdminActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  showDelete?: boolean;
  isWixEvent?: boolean;
  isPublished?: boolean;
  showPublishToggle?: boolean;
  canManageEvents?: boolean;
}

export function AdminActions({ 
  onEdit, 
  onDelete, 
  onTogglePublish,
  showDelete, 
  isWixEvent,
  isPublished = true,
  showPublishToggle = true,
  canManageEvents = false
}: AdminActionsProps) {
  if (!canManageEvents) return null;

  return (
    <>
      {!isWixEvent && (
        <>
          <Button
            variant="outline"
            onClick={onEdit}
            className="ml-auto"
          >
            <Edit2Icon className="w-4 h-4 mr-2" />
            Edit
          </Button>

          {showPublishToggle && onTogglePublish && (
            <Button
              variant="outline"
              onClick={onTogglePublish}
              className="ml-2"
            >
              {isPublished ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          )}
        </>
      )}

      {showDelete && (
        <Button
          variant="destructive"
          onClick={onDelete}
          className="ml-2"
        >
          <Trash2Icon className="w-4 h-4 mr-2" />
          Delete
        </Button>
      )}
    </>
  );
}