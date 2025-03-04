
import { useState } from "react";
import { Event } from "@/types/event";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

export function useEventCard(event: Event) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { verifyPermission } = usePermissions();
  
  const handleEdit = async () => {
    // Check if user has permission to edit
    const hasPermission = await verifyPermission(
      'edit',
      event.id,
      event.created_by
    );
    
    if (hasPermission) {
      setIsDialogOpen(true);
    }
  };
  
  const handleDelete = async () => {
    // Check if user has permission to delete
    const hasPermission = await verifyPermission(
      'delete',
      event.id,
      event.created_by
    );
    
    if (!hasPermission) {
      toast.error("You don't have permission to delete this event");
      return;
    }
    
    // Deletion logic would go here
    console.log("Deleting event:", event.id);
  };
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  return {
    isDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleEdit,
    handleDelete
  };
}
