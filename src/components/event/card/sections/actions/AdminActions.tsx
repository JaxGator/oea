
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
  
  // If no user, don't render anything
  if (!user) {
    console.log("AdminActions - No user found");
    return null;
  }
  
  // Force isAdmin to be true if user.is_admin is true, regardless of prop
  const effectiveIsAdmin = user.is_admin === true || isAdmin === true;
  
  // Updated: Consider both admin status and the canManageEvents prop for permissions
  // Any approved member (is_approved=true) or member (is_member=true) should be able to manage events
  const effectiveCanManage = effectiveIsAdmin || propsCanManageEvents || user.is_approved === true || user.is_member === true;
  
  // Calculate permissions with the effective admin and management status
  const canEdit = canEditEvent(user.id, effectiveIsAdmin, effectiveCanManage, createdBy);
  const canDelete = canDeleteEvent(user.id, effectiveIsAdmin, effectiveCanManage, createdBy);
  
  console.log("AdminActions - Final permissions:", {
    userId: user.id,
    effectiveIsAdmin,
    effectiveCanManage,
    canEdit,
    canDelete,
    timestamp: new Date().toISOString()
  });

  // Handle edit with feedback
  const handleEdit = () => {
    if (isPastEvent) {
      toast.info("Past events can only be edited by administrators");
      return;
    }
    
    if (onEdit) onEdit();
  };

  // Handle delete with confirmation and feedback
  const handleDelete = async () => {
    if (isPastEvent) {
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
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit && !isWixEvent && onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
          disabled={isPastEvent && !effectiveIsAdmin}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      
      {canDelete && !isWixEvent && showDelete && onDelete && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={isPastEvent && !effectiveIsAdmin || isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      )}
      
      {showPublishToggle && onTogglePublish && (effectiveIsAdmin || effectiveCanManage) && (
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
