
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent, canDeleteEvent } from "@/utils/permissionsUtils";

interface AdminActionsProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  showDelete?: boolean;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  createdBy: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
}

export function AdminActions({
  isAdmin,
  canManageEvents,
  isPastEvent,
  isWixEvent,
  showDelete = false,
  showPublishToggle = false,
  isPublished = true,
  createdBy,
  onEdit,
  onDelete,
  onTogglePublish
}: AdminActionsProps) {
  const { user } = useAuthState();
  
  if (!user) return null;
  
  const canEdit = canEditEvent(user.id, isAdmin, canManageEvents, createdBy);
  const canDelete = canDeleteEvent(user.id, isAdmin, canManageEvents, createdBy);
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit && !isWixEvent && onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit} disabled={isPastEvent}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      {canDelete && !isWixEvent && showDelete && onDelete && (
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={isPastEvent}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
      {showPublishToggle && onTogglePublish && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onTogglePublish}
        >
          {isPublished ? (
            <>
              <ToggleRight className="h-4 w-4 mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <ToggleLeft className="h-4 w-4 mr-2" />
              Publish
            </>
          )}
        </Button>
      )}
    </div>
  );
}
