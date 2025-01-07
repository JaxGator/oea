import { Edit, UserCheck } from "lucide-react";
import { AdminDropdownMenu } from "./shared/AdminDropdownMenu";

interface UserActionsMenuProps {
  onEdit: () => void;
  onUpdateStatus: () => void;
  isUpdating: boolean;
}

export function UserActionsMenu({ onEdit, onUpdateStatus, isUpdating }: UserActionsMenuProps) {
  console.log('UserActionsMenu render');
  
  const handleEdit = (e: React.MouseEvent) => {
    console.log('Edit clicked');
    onEdit();
  };

  const handleUpdateStatus = (e: React.MouseEvent) => {
    console.log('Update status clicked');
    onUpdateStatus();
  };

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit
    },
    {
      label: "Update Status",
      icon: <UserCheck className="mr-2 h-4 w-4" />,
      onClick: handleUpdateStatus,
      disabled: isUpdating
    }
  ];

  return <AdminDropdownMenu actions={actions} />;
}