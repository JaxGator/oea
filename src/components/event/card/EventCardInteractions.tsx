import { Event } from "@/types/event";
import { EventCardWrapper } from "../EventCardWrapper";
import { EventCardHeader } from "../EventCardHeader";
import { EventCardContent } from "./EventCardContent";
import { useEventInteractions } from "@/hooks/events/useEventInteractions";

interface EventCardInteractionsProps {
  event: Event;
  isAdmin: boolean;
  canManageEvents: boolean;
  rsvpData: { confirmedCount: number; waitlistCount: number };
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  guests: { firstName: string }[];
  isSelected?: boolean;
  onSelect?: () => void;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  setShowEditDialog: (show: boolean) => void;
  setShowDetailsDialog: (show: boolean) => void;
  handleDelete: () => void;
  isPublished: boolean;
  onTogglePublish?: () => void;
}

export function EventCardInteractions({
  event,
  isAdmin,
  canManageEvents,
  rsvpData,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  guests,
  isSelected = false,
  onRSVP,
  onCancelRSVP,
  setShowEditDialog,
  setShowDetailsDialog,
  handleDelete,
  isPublished,
  onTogglePublish,
}: EventCardInteractionsProps) {
  const { handleCardClick } = useEventInteractions(setShowDetailsDialog);

  return (
    <EventCardWrapper
      title={event.title}
      onInteraction={handleCardClick}
      onKeyDown={handleCardClick}
      isFeatured={event.is_featured}
      isSelected={isSelected}
      isPublished={isPublished}
    >
      <EventCardHeader imageUrl={event.image_url} title={event.title} />
      <EventCardContent
        event={event}
        rsvpCount={rsvpData.confirmedCount}
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        userRSVPStatus={userRSVPStatus}
        isPastEvent={isPastEvent}
        canAddGuests={canAddGuests}
        waitlistEnabled={event.waitlist_enabled}
        waitlistCount={rsvpData.waitlistCount}
        waitlistCapacity={event.waitlist_capacity}
        currentGuests={guests}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={() => setShowEditDialog(true)}
        onDelete={handleDelete}
        showPublishToggle={!isPastEvent}
        isPublished={isPublished}
        onViewDetails={() => setShowDetailsDialog(true)}
        onTogglePublish={onTogglePublish}
      />
    </EventCardWrapper>
  );
}