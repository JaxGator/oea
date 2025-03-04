
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/auth/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import { useSession } from "@/hooks/auth/useSession";
import { PermissionService } from "@/services/permissions/permissionService";
import { usePermissions } from "@/hooks/usePermissions";

interface UseEventActionsProps {
  event: Event;
  onUpdate?: () => void;
}

export const useEventActions = ({ event, onUpdate }: UseEventActionsProps) => {
  const { user } = useSession();
  const { data: profile } = useProfile(user?.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { verifyPermission } = usePermissions();

  const handleDelete = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete events",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Check if user has permission to delete
    const hasPermission = await verifyPermission('delete', event.id, event.created_by);
    
    if (!hasPermission && !profile?.is_admin) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete this event",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event deleted successfully",
      });

      if (onUpdate) {
        onUpdate();
      }

      navigate("/events");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [event, user, profile, toast, navigate, onUpdate, verifyPermission]);

  const handleTogglePublish = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to publish/unpublish events",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Check if user has permission to manage this event
    const hasPermission = await verifyPermission('manage', event.id, event.created_by);
    
    if (!hasPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to publish/unpublish this event",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPublishing(true);
      const newPublishState = !event.is_published;
      
      const { error } = await supabase
        .from("events")
        .update({ is_published: newPublishState })
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: newPublishState 
          ? "Event published successfully" 
          : "Event unpublished successfully",
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Error toggling publish state:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event publish state",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  }, [event, user, toast, navigate, onUpdate, verifyPermission]);

  return {
    isDeleting,
    isPublishing,
    handleDelete,
    handleTogglePublish,
  };
};
