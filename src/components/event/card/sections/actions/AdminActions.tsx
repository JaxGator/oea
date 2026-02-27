
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { useActionFeedback } from "@/hooks/ui/useActionFeedback";

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
  canManageEvents: propsCanManageEvents,
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
  const { executeAction, isLoading } = useActionFeedback();

  const effectiveIsAdmin = isAdmin || !!user?.is_admin;
  const effectiveCanManage = effectiveIsAdmin || propsCanManageEvents || !!user?.is_approved || !!user?.is_member;
  const canEdit = effectiveCanManage || user?.id === createdBy;
  const canDelete = effectiveIsAdmin || (!!user?.is_member && user?.id === createdBy);

  if (!canEdit) return null;

  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  const handleDelete = async () => {
    if (onDelete) {
      await executeAction(
        () => { onDelete(); return Promise.resolve(true); },
        { loadingMessage: "Deleting event...", successMessage: "Event deleted successfully", errorMessage: "Failed to delete event" }
      );
    }
  };

  const handleTogglePublish = async () => {
    if (onTogglePublish) {
      await executeAction(
        () => { onTogglePublish(); return Promise.resolve(true); },
        { loadingMessage: isPublished ? "Unpublishing event..." : "Publishing event...", successMessage: isPublished ? "Event unpublished" : "Event published", errorMessage: isPublished ? "Failed to unpublish event" : "Failed to publish event" }
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isWixEvent && onEdit && canEdit && (
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      {!isWixEvent && showDelete && onDelete && canDelete && (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
      {showPublishToggle && onTogglePublish && effectiveCanManage && (
        <Button variant="secondary" size="sm" onClick={handleTogglePublish} disabled={isLoading}>
          {isPublished ? (
            <><ToggleRight className="h-4 w-4 mr-2" />Unpublish</>
          ) : (
            <><ToggleLeft className="h-4 w-4 mr-2" />Publish</>
          )}
        </Button>
      )}
    </div>
  );
}
