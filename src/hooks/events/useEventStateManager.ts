import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event } from "@/types/event";

export function useEventStateManager(event: Event, onUpdate?: () => void) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editedRSVPCount, setEditedRSVPCount] = useState("");
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);

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

  const handleEditRSVP = () => {
    setEditedRSVPCount(event.imported_rsvp_count?.toString() || "0");
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
    } catch (error: any) {
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

  return {
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
  };
}