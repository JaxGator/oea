import { AdminDropdownMenu } from "@/components/admin/user-management/shared/AdminDropdownMenu";
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
    ...(showDelete ? [{
      label: "Delete",
      icon: <Trash2Icon className="h-4 w-4 mr-2" />,
      onClick: onDelete,
      className: "text-destructive"
    }] : [])
  ];

  if (actions.length === 0) return null;

  return <AdminDropdownMenu actions={actions} />;
}