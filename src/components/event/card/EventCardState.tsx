
import { Event } from "@/types/event";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useEventStateManager } from "@/hooks/events/useEventStateManager";
import { useGuestListUpdates } from "@/hooks/events/useGuestListUpdates";
import { useEffect } from "react";
import { parseISO, set } from "date-fns";
import { useAuthState } from "@/hooks/useAuthState";

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
  }) => React.ReactNode;
}

export function EventCardState({
  event,
  userRSVPStatus,
  onUpdate,
  isAuthenticated = false,
  children
}: EventCardStateProps) {
  const { isAdmin, canManageEvents } = useAdminStatus();
  const { user } = useAuthState();
  const { data: attendees = [] } = useEventRSVPData(event.id);
  const { data: guests = [], refetch: refetchGuests } = useEventGuestData(event.id, userRSVPStatus);
  
  useGuestListUpdates(event.id, refetchGuests);
  
  // Force isAdmin to true if the user profile has admin status
  const effectiveIsAdmin = isAdmin || !!user?.is_admin;
  const effectiveCanManage = effectiveIsAdmin || canManageEvents || !!(user?.is_approved);
  
  useEffect(() => {
    console.log("EventCardState - Admin status:", {
      hookIsAdmin: isAdmin,
      userIsAdmin: user?.is_admin,
      effectiveIsAdmin,
      hookCanManage: canManageEvents,
      userIsApproved: user?.is_approved,
      effectiveCanManage,
      timestamp: new Date().toISOString()
    });
  }, [isAdmin, user?.is_admin, effectiveIsAdmin, canManageEvents, user?.is_approved, effectiveCanManage]);
  
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
  const canAddGuests = effectiveIsAdmin || userRSVPStatus === 'attending';

  console.log('EventCardState - Event timing:', {
    eventDate: event.date,
    eventTime: event.time,
    eventDateTime,
    now,
    isPastEvent
  });

  return children({
    isAdmin: effectiveIsAdmin,
    canManageEvents: effectiveCanManage,
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
    isAuthenticated
  });
}
