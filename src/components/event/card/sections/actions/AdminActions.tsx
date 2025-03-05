
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useActionFeedback } from "@/hooks/ui/useActionFeedback";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { LoadingButton } from "@/components/ui/loading-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminActionsProps {
  isPastEvent: boolean;
  isWixEvent: boolean;
  showDelete?: boolean;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  createdBy: string;
  eventId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
}

export function AdminActions({
  isPastEvent,
  isWixEvent,
  showDelete = false,
  showPublishToggle = false,
  isPublished = true,
  createdBy,
  eventId,
  onEdit,
  onDelete,
  onTogglePublish
}: AdminActionsProps) {
  const { executeAction, isLoading } = useActionFeedback();
  const { 
    getEffectivePermissions,
    isVerifying
  } = usePermissions();
  
  // Get synchronous permissions for immediate render decision
  const { isAdmin, canManageEvents } = getEffectivePermissions();
  
  // If user is admin or can manage events, they can perform any action
  const effectiveCanEdit = isAdmin || canManageEvents || createdBy === getEffectivePermissions().userId;
  const effectiveCanDelete = isAdmin || canManageEvents || createdBy === getEffectivePermissions().userId;
  const effectiveCanManage = isAdmin || canManageEvents;

  // Handle edit with feedback
  const handleEdit = () => {
    if (isPastEvent && !isAdmin) {
      toast.info("Past events can only be edited by administrators");
      return;
    }
    
    if (!effectiveCanEdit) {
      toast.error("You don't have permission to edit this event");
      return;
    }
    
    if (onEdit) onEdit();
  };

  // Handle delete with confirmation and feedback
  const handleDelete = async () => {
    if (isPastEvent && !isAdmin) {
      toast.info("Past events can only be deleted by administrators");
      return;
    }
    
    if (!effectiveCanDelete) {
      toast.error("You don't have permission to delete this event");
      return;
    }
    
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
    if (!effectiveCanManage) {
      toast.error("You don't have permission to publish or unpublish events");
      return;
    }
    
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
  
  // Nothing to display if no actions are available or the user is still being verified
  if (!onEdit && !onDelete && !onTogglePublish) {
    return null;
  }

  // Render the admin actions based on permissions
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {!isWixEvent && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEdit}
            disabled={isPastEvent && !isAdmin || isVerifying}
            className={!effectiveCanEdit ? "opacity-70" : ""}
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
            disabled={isPastEvent && !isAdmin || isLoading || isVerifying}
            className={!effectiveCanDelete ? "opacity-70" : ""}
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
            disabled={isLoading || isVerifying}
            className={!effectiveCanManage ? "opacity-70" : ""}
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
    </div>
  );
}
