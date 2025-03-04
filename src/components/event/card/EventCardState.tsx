
import { Event } from "@/types/event";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";
import { useEventStateManager } from "@/hooks/events/useEventStateManager";
import { useGuestListUpdates } from "@/hooks/events/useGuestListUpdates";
import { useEffect } from "react";
import { parseISO, set } from "date-fns";
import { useAuthState } from "@/hooks/useAuthState";
import { useCarouselConfig } from "@/hooks/gallery/useCarouselConfig";
import { usePermissions } from "@/hooks/usePermissions";

interface EventCardStateProps {
  event: Event;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  isAuthenticated?: boolean;
  children: (props: {
    isAdmin: boolean;
    canManageEvents: boolean;
    rsvpData: { confirmedCount: number; waitlistCount: number };
    attendees: any[];
    guests: { firstName: string }[];
    isPastEvent: boolean;
    isWixEvent: boolean;
    canAddGuests: boolean;
    showEditDialog: boolean;
    showDetailsDialog: boolean;
    editedRSVPCount: string;
    isEditingRSVP: boolean;
    handleEditSuccess: () => void;
    handleDelete: () => void;
    handleTogglePublish: () => void;
    setShowEditDialog: (show: boolean) => void;
    setShowDetailsDialog: (show: boolean) => void;
    handleEditRSVP: () => void;
    handleSaveRSVP: () => Promise<void>;
    handleCancelEdit: () => void;
    handleRSVPCountChange: (value: string) => void;
    isAuthenticated?: boolean;
    isConfiguring?: boolean;
  }) => React.ReactNode;
}

export function EventCardState({
  event,
  userRSVPStatus,
  onUpdate,
  isAuthenticated = false,
  children
}: EventCardStateProps) {
  const { data: attendees = [] } = useEventRSVPData(event.id);
  const { data: guests = [], refetch: refetchGuests } = useEventGuestData(event.id, userRSVPStatus);
  const { carouselEnabled } = useCarouselConfig();
  const { user } = useAuthState();
  const { getEffectivePermissions } = usePermissions();
  
  // Get synchronous permissions
  const { isAdmin, canManageEvents } = getEffectivePermissions();
  
  useGuestListUpdates(event.id, refetchGuests);
  
  // Use the authenticated state from props if provided, otherwise use the value from useAuthState
  const effectiveIsAuthenticated = isAuthenticated !== undefined ? isAuthenticated : user !== null;
  
  const {
    showEditDialog,
    showDetailsDialog,
    editedRSVPCount,
    isEditingRSVP,
    setShowEditDialog,
    setShowDetailsDialog,
    handleEditSuccess,
    handleDelete,
    handleTogglePublish,
    handleEditRSVP,
    handleSaveRSVP,
    handleCancelEdit,
    handleRSVPCountChange,
    cleanupModals
  } = useEventStateManager(event, onUpdate);

  useEffect(() => {
    return () => {
      cleanupModals();
    };
  }, [event.id, cleanupModals]);

  const rsvpData = {
    confirmedCount: attendees.length,
    waitlistCount: 0
  };

  const now = new Date();
  const [hours, minutes] = event.time.split(':').map(Number);
  const eventDateTime = set(parseISO(event.date), {
    hours: hours || 0,
    minutes: minutes || 0,
  });
  const isPastEvent = eventDateTime < now;
  const isWixEvent = !!event.imported_rsvp_count;
  
  // Allow admins, approved members, and the event creator to add guests
  // Also check authentication status before allowing guest additions
  const canAddGuests = effectiveIsAuthenticated && (
    isAdmin || canManageEvents || userRSVPStatus === 'attending'
  );

  return children({
    isAdmin,
    canManageEvents,
    rsvpData,
    attendees,
    guests,
    isPastEvent,
    isWixEvent,
    canAddGuests,
    showEditDialog,
    showDetailsDialog,
    editedRSVPCount,
    isEditingRSVP,
    handleEditSuccess,
    handleDelete,
    handleTogglePublish,
    setShowEditDialog,
    setShowDetailsDialog,
    handleEditRSVP,
    handleSaveRSVP,
    handleCancelEdit,
    handleRSVPCountChange,
    isAuthenticated: effectiveIsAuthenticated,
    isConfiguring: isEditingRSVP
  });
}
