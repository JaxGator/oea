
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useEventStateManager(event: any, onUpdate?: () => void) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editedRSVPCount, setEditedRSVPCount] = useState(String(event?.imported_rsvp_count || ""));
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);
  const queryClient = useQueryClient();

  const handleEditSuccess = useCallback(() => {
    console.log("Edit success triggered");
    setShowEditDialog(false);
    
    // Invalidate all event-related queries to force a refresh
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['event', event?.id] });
    
    // Additional invalidation for related queries
    queryClient.invalidateQueries({ queryKey: ['events-with-rsvps'] });
    
    if (onUpdate) {
      onUpdate();
    }
    
    // Force a window reload to ensure all data is refreshed
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }, [event?.id, onUpdate, queryClient]);

  const handleDelete = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;
      
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Error deleting event");
    }
  }, [event.id, onUpdate, queryClient]);

  const handleTogglePublish = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_published: !event.is_published })
        .eq('id', event.id);

      if (error) throw error;
      
      toast.success(`Event ${event.is_published ? 'unpublished' : 'published'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error updating event publish status:", error);
      toast.error(error.message || "Error updating event");
    }
  }, [event.id, event.is_published, onUpdate, queryClient]);

  const handleEditRSVP = useCallback(() => {
    setIsEditingRSVP(true);
    setEditedRSVPCount(String(event?.imported_rsvp_count || ""));
  }, [event?.imported_rsvp_count]);

  const handleSaveRSVP = useCallback(async () => {
    try {
      const count = parseInt(editedRSVPCount, 10);
      if (isNaN(count) || count < 0) {
        throw new Error("RSVP count must be a positive number");
      }

      const { error } = await supabase
        .from('events')
        .update({ imported_rsvp_count: count })
        .eq('id', event.id);

      if (error) throw error;
      
      toast.success("RSVP count updated successfully");
      setIsEditingRSVP(false);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error updating RSVP count:", error);
      toast.error(error.message || "Error updating RSVP count");
    }
  }, [editedRSVPCount, event.id, onUpdate, queryClient]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingRSVP(false);
  }, []);

  const handleRSVPCountChange = useCallback((value: string) => {
    setEditedRSVPCount(value);
  }, []);

  const cleanupModals = useCallback(() => {
    setShowEditDialog(false);
    setShowDetailsDialog(false);
  }, []);

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
    cleanupModals
  };
}
