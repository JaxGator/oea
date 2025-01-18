import { useState } from "react";
import { useAdminStatus } from "./useAdminStatus";
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useEventCardState(event: Event, onUpdate?: () => void) {
  const { isAdmin, canManageEvents } = useAdminStatus();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

  return {
    isAdmin,
    canManageEvents,
    showEditDialog,
    showDetailsDialog,
    setShowEditDialog,
    setShowDetailsDialog,
    handleEditSuccess,
    handleDelete,
    handleTogglePublish,
  };
}