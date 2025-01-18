import { Event } from "@/types/event";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventCardStateProps {
  event: Event;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
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
    handleEditSuccess: () => void;
    handleDelete: () => void;
    handleTogglePublish: () => void;
    setShowEditDialog: (show: boolean) => void;
    setShowDetailsDialog: (show: boolean) => void;
  }) => React.ReactNode;
}

export function EventCardState({
  event,
  userRSVPStatus,
  onUpdate,
  children
}: EventCardStateProps) {
  const { isAdmin, canManageEvents } = useAdminStatus();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Fetch RSVPs and attendees using custom hooks
  const { data: attendees = [] } = useEventRSVPData(event.id);
  const { data: guests = [] } = useEventGuestData(event.id, userRSVPStatus);

  const rsvpData = {
    confirmedCount: attendees.length,
    waitlistCount: 0 // You might want to implement this in the future
  };

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = !!event.imported_rsvp_count;
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast.success("Event deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleTogglePublish = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_published: !event.is_published })
        .eq('id', event.id);

      if (error) throw error;

      toast.success(`Event ${event.is_published ? 'unpublished' : 'published'} successfully`);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error toggling event publish status:', error);
      toast.error(error.message || "Failed to update event status");
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      setShowDetailsDialog(true);
    }
  };

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
    handleEditSuccess,
    handleDelete,
    handleTogglePublish,
    setShowEditDialog,
    setShowDetailsDialog,
    handleInteraction,
  });
}
