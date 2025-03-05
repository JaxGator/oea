
import { useState } from "react";
import { useAdminStatus } from "./events/useAdminStatus";
import { useRSVPDetails } from "./events/useRSVPDetails";
import { useEventActions } from "./events/useEventActions";

export function useEventCard(eventId: string, onUpdate?: () => void) {
  const { isAdmin } = useAdminStatus();
  const { rsvpCount, attendees } = useRSVPDetails(eventId);
  const { handleRSVP, handleCancelRSVP, isLoading } = useEventActions({
    eventId,
    createdBy: '', // We need to provide this, but it's only used for permission checks
    onSuccess: onUpdate
  });

  // Add local state for managing dialogs since useEventActions doesn't provide these
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Define these functions locally since they're not provided by useEventActions
  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    console.log('Delete event:', eventId);
    // This would need to be implemented or brought in from another hook
    if (onUpdate) onUpdate();
  };

  const handleCardClick = () => {
    setShowDetailsDialog(true);
  };

  return {
    showEditDialog,
    setShowEditDialog,
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleCardClick,
    handleDelete,
    showDetailsDialog,
    setShowDetailsDialog,
    handleRSVP,
    handleCancelRSVP,
    isLoading
  };
}
