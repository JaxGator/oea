
import { AdminDropdownMenu } from "@/components/admin/user-management/shared/AdminDropdownMenu";
import { Edit2Icon, Trash2Icon, Eye, EyeOff } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

interface AdminActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  showDelete?: boolean;
  isWixEvent?: boolean;
  isPublished?: boolean;
  showPublishToggle?: boolean;
  canManageEvents?: boolean;
  event?: { id: string; created_by?: string };
}

export function AdminActions({ 
  onEdit, 
  onDelete, 
  onTogglePublish,
  showDelete = false, 
  isWixEvent = false,
  isPublished = true,
  showPublishToggle = true,
  canManageEvents = false,
  event
}: AdminActionsProps) {
  const { profile } = useAuthState();
  
  // Check if user can delete this event
  const canDelete = profile?.is_admin || (profile?.is_member && event?.created_by === profile?.id);

  // Debug log for visibility into permissions
  console.log('AdminActions - Permissions check:', {
    isAdmin: profile?.is_admin,
    canManageEvents,
    profileId: profile?.id,
    eventCreator: event?.created_by,
    canDelete,
    showDelete,
    hasEditHandler: !!onEdit,
    hasDeleteHandler: !!onDelete,
    hasPublishToggleHandler: !!onTogglePublish
  });

  if (!canManageEvents && !profile?.is_admin) return null;

  const actions = [
    ...((!isWixEvent && onEdit) ? [{
      label: "Edit",
      icon: <Edit2Icon className="h-4 w-4 mr-2" />,
      onClick: onEdit
    }] : []),
    ...((showPublishToggle && onTogglePublish) ? [{
      label: isPublished ? "Unpublish" : "Publish",
      icon: isPublished ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />,
      onClick: onTogglePublish
    }] : []),
    ...(canDelete ? [{
      label: "Delete",
      icon: <Trash2Icon className="h-4 w-4 mr-2" />,
      onClick: onDelete,
      className: "text-destructive"
    }] : [])
  ];

  if (actions.length === 0) return null;

  return <AdminDropdownMenu actions={actions} />;
}
