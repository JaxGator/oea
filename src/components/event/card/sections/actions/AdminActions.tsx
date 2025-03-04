
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent, canDeleteEvent } from "@/utils/permissionsUtils";
import { useEffect } from "react";

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
  
  // Log auth state and permissions on mount and when they change
  useEffect(() => {
    if (user) {
      console.log("AdminActions - Auth state:", {
        userId: user?.id,
        profileIsAdmin: user?.is_admin,
        propsIsAdmin: isAdmin,
        propsCanManageEvents: canManageEvents,
        eventCreator: createdBy,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, isAdmin, canManageEvents, createdBy]);
  
  // If no user, don't render anything
  if (!user) {
    console.log("AdminActions - No user found");
    return null;
  }
  
  // Force isAdmin to be true if user.is_admin is true, regardless of prop
  const effectiveIsAdmin = user.is_admin === true || isAdmin === true;
  const effectiveCanManage = effectiveIsAdmin || canManageEvents;
  
  // Calculate permissions with the effective admin status
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
