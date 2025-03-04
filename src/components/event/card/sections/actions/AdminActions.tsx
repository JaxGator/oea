
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useActionFeedback } from "@/hooks/ui/useActionFeedback";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { LoadingButton } from "@/components/ui/loading-button";

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
    verifyPermission, 
    isVerifying,
    getEffectivePermissions
  } = usePermissions();
  
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  
  // Get synchronous permissions for initial render
  const { isAdmin, canManageEvents } = getEffectivePermissions();
  
  // Check permissions when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      setIsCheckingPermissions(true);
      
      // Check all required permissions
      const [canEditResult, canDeleteResult, canManageResult] = await Promise.all([
        verifyPermission('edit', eventId, createdBy),
        verifyPermission('delete', eventId, createdBy),
        verifyPermission('manage', eventId, createdBy)
      ]);
      
      setCanEdit(canEditResult);
      setCanDelete(canDeleteResult);
      setCanManage(canManageResult);
      setIsCheckingPermissions(false);
    };
    
    checkPermissions();
  }, [eventId, createdBy, verifyPermission]);

  // Handle edit with feedback
  const handleEdit = () => {
    if (isPastEvent && !isAdmin) {
      toast.info("Past events can only be edited by administrators");
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
  
  const isCheckingAnyPermission = isCheckingPermissions || isVerifying;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isWixEvent && onEdit && (
        <LoadingButton 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
          disabled={isPastEvent && !isAdmin}
          isVerifyingPermission={isCheckingAnyPermission}
          permissionDenied={!isCheckingAnyPermission && !canEdit}
          permissionMessage="You don't have permission to edit this event"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </LoadingButton>
      )}
      
      {!isWixEvent && showDelete && onDelete && (
        <LoadingButton 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={isPastEvent && !isAdmin || isLoading}
          isVerifyingPermission={isCheckingAnyPermission}
          permissionDenied={!isCheckingAnyPermission && !canDelete}
          permissionMessage="You don't have permission to delete this event"
          isLoading={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </LoadingButton>
      )}
      
      {showPublishToggle && onTogglePublish && (
        <LoadingButton
          variant="secondary"
          size="sm"
          onClick={handleTogglePublish}
          disabled={isLoading}
          isVerifyingPermission={isCheckingAnyPermission}
          permissionDenied={!isCheckingAnyPermission && !canManage}
          permissionMessage="You don't have permission to publish/unpublish events"
          isLoading={isLoading}
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
        </LoadingButton>
      )}
    </div>
  );
}
