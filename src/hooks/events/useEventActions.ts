import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useEventActions(eventId: string, onUpdate?: () => void) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const navigate = useNavigate();

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success("Event deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the click is on or within an interactive element
    const isInteractive = (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('[role="button"]') ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[contenteditable="true"]') ||
      target.closest('dialog') ||
      target.closest('.dialog') ||
      target.closest('[data-interactive="true"]') ||
      target.closest('.quill') ||  // Added to prevent navigation when clicking on the editor
      target.closest('[role="dialog"]')
    );

    // Only navigate if the click is not on an interactive element
    if (!isInteractive) {
      navigate(`/events/${eventId}`);
    }
  };

  return {
    showEditDialog,
    setShowEditDialog,
    handleEditSuccess,
    handleDelete,
    handleCardClick
  };
}