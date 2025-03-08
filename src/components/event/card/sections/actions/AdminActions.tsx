
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent, canDeleteEvent, isAdministrator, canManageEvents } from "@/utils/permissionsUtils";
import { useEffect } from "react";
import { useActionFeedback } from "@/hooks/ui/useActionFeedback";
import { toast } from "sonner";

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
  
  // Log auth state and permissions on mount and when they change
  useEffect(() => {
    if (user) {
      console.log("AdminActions - Auth state:", {
        userId: user?.id,
        profileIsAdmin: user?.is_admin,
        profileIsApproved: user?.is_approved,
        profileIsMember: user?.is_member,
        propsIsAdmin: isAdmin,
        propsCanManageEvents,
        eventCreator: createdBy,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, isAdmin, propsCanManageEvents, createdBy]);
  
  // Force admin permissions to true
  const effectiveIsAdmin = true;
  const effectiveCanManage = true;
  const canEdit = true;
  const canDelete = true;

  // Handle edit with feedback
  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  // Handle delete with confirmation and feedback
  const handleDelete = async () => {
    if (onDelete) {
      await executeAction(
        () => {
          onDelete();
          return Promise.resolve(true);
        },
        {
          loadingMessage: "Deleting event...",
          successMessage: "Event deleted successfully",
          errorMessage: "Failed to delete event"
        }
      );
    }
  };

  // Handle publish/unpublish with feedback
  const handleTogglePublish = async () => {
    if (onTogglePublish) {
      await executeAction(
        () => {
          onTogglePublish();
          return Promise.resolve(true);
        },
        {
          loadingMessage: isPublished ? "Unpublishing event..." : "Publishing event...",
          successMessage: isPublished ? "Event unpublished" : "Event published",
          errorMessage: isPublished ? "Failed to unpublish event" : "Failed to publish event"
        }
      );
    }
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isWixEvent && onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      
      {!isWixEvent && showDelete && onDelete && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
      
      {showPublishToggle && onTogglePublish && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTogglePublish}
          disabled={isLoading}
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
