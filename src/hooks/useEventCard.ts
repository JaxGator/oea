import { useAdminStatus } from "./events/useAdminStatus";
import { useRSVPDetails } from "./events/useRSVPDetails";
import { useEventActions } from "./events/useEventActions";

export function useEventCard(eventId: string, onUpdate?: () => void) {
  const { isAdmin } = useAdminStatus();
  const { rsvpCount, attendees } = useRSVPDetails(eventId);
  const {
    showEditDialog,
    setShowEditDialog,
    handleEditSuccess,
    handleDelete,
    handleCardClick
  } = useEventActions(eventId, onUpdate);

  return {
    showEditDialog,
    setShowEditDialog,
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleCardClick,
    handleDelete
  };
}