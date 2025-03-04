
import { useState } from "react";
import { Event } from "@/types/event";
import { useEventActions, UseEventActionsProps } from "./useEventActions";

export function useEventCard(event: Event) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Properly format the event for the useEventActions hook
  const eventActionProps: UseEventActionsProps = {
    event: event,
    // Add other required properties if needed
  };
  
  const { handleEdit, handleDelete } = useEventActions(eventActionProps);
  
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
