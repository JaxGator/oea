import { Event } from "@/types/event";
import { EventCardWrapper } from "../EventCardWrapper";
import { EventCardHeader } from "../EventCardHeader";
import { EventCardContent } from "./EventCardContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  onSelect,
  onRSVP,
  onCancelRSVP,
  setShowEditDialog,
  setShowDetailsDialog,
  handleDelete,
  isPublished,
}: EventCardInteractionsProps) {
  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onSelect) {
      onSelect();
    }
    
    // Check if the event is coming from an interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]');

    // If it's an interactive element, let it handle its own click
    if (isInteractiveElement) {
      return;
    }

    // For keyboard events, only proceed if it's Enter or Space
    if (e.type === 'keydown') {
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }
      // Prevent page scroll on space press
      if (keyEvent.key === ' ') {
        keyEvent.preventDefault();
      }
    }

    setShowDetailsDialog(true);
  };

  const handleTogglePublish = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_published: !isPublished })
        .eq('id', event.id);

      if (error) throw error;

      toast.success(`Event ${isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error("Failed to update event publish status");
    }
  };

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
        onTogglePublish={!isPastEvent ? handleTogglePublish : undefined}
        isPublished={isPublished}
        onViewDetails={() => setShowDetailsDialog(true)}
      />
    </EventCardWrapper>
  );
}