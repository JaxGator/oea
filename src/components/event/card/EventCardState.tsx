import { Event } from "@/types/event";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";
import { useEventCardState } from "@/hooks/events/useEventCardState";
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
  }) => React.ReactNode;
}

export function EventCardState({
  event,
  userRSVPStatus,
  onUpdate,
  children
}: EventCardStateProps) {
  const { data: attendees = [] } = useEventRSVPData(event.id);
  const { data: guests = [] } = useEventGuestData(event.id, userRSVPStatus);
  const [editedRSVPCount, setEditedRSVPCount] = useState("");
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);
  
  const {
    isAdmin,
    canManageEvents,
    showEditDialog,
    showDetailsDialog,
    setShowEditDialog,
    setShowDetailsDialog,
    handleEditSuccess,
    handleDelete,
    handleTogglePublish,
  } = useEventCardState(event, onUpdate);

  const rsvpData = {
    confirmedCount: attendees.length,
    waitlistCount: 0 // You might want to implement this in the future
  };

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = !!event.imported_rsvp_count;
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const handleEditRSVP = () => {
    setEditedRSVPCount(rsvpData.confirmedCount.toString());
    setIsEditingRSVP(true);
  };

  const handleSaveRSVP = async () => {
    try {
      const count = parseInt(editedRSVPCount);
      if (isNaN(count) || count < 0) {
        toast.error("Please enter a valid number");
        return;
      }

      const { error } = await supabase
        .from('events')
        .update({ imported_rsvp_count: count })
        .eq('id', event.id);

      if (error) throw error;

      toast.success("RSVP count updated successfully");
      setIsEditingRSVP(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating RSVP count:', error);
      toast.error("Failed to update RSVP count");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingRSVP(false);
    setEditedRSVPCount("");
  };

  const handleRSVPCountChange = (value: string) => {
    setEditedRSVPCount(value);
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
    handleRSVPCountChange
  });
}