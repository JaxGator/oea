import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useEventInteraction } from "@/hooks/events/useEventInteraction";
import { useEventWaitlist } from "@/hooks/events/useEventWaitlist";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";
import { Event } from "@/types/event";

interface EventCardStateProps {
  event: Event;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  children: (props: {
    isAdmin: boolean;
    rsvpData: { confirmedCount: number; waitlistCount: number };
    attendees: any[];
    guests: { firstName: string }[];
    waitlistCount: number;
    isPastEvent: boolean;
    isWixEvent: boolean;
    canAddGuests: boolean;
    showEditDialog: boolean;
    showDetailsDialog: boolean;
    handleEditSuccess: () => void;
    handleDelete: () => void;
    setShowEditDialog: (show: boolean) => void;
    setShowDetailsDialog: (show: boolean) => void;
    handleInteraction: (e: React.MouseEvent | React.KeyboardEvent) => void;
  }) => React.ReactNode;
}

export function EventCardState({ event, userRSVPStatus, onUpdate, children }: EventCardStateProps) {
  const { 
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleDelete,
  } = useEventCard(event.id, onUpdate);

  const { showEditDialog, setShowEditDialog } = useEventDialogs();
  const { showDetailsDialog, setShowDetailsDialog, handleInteraction } = useEventInteraction();
  const { waitlistCount } = useEventWaitlist(event.id, event.waitlist_enabled);
  const { data: rsvpData = { confirmedCount: 0, waitlistCount: 0 } } = useEventRSVPData(event.id);
  const { data: guests = [] } = useEventGuestData(event.id, userRSVPStatus);

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  return children({
    isAdmin,
    rsvpData,
    attendees,
    guests,
    waitlistCount,
    isPastEvent,
    isWixEvent,
    canAddGuests,
    showEditDialog,
    showDetailsDialog,
    handleEditSuccess,
    handleDelete,
    setShowEditDialog,
    setShowDetailsDialog,
    handleInteraction,
  });
}