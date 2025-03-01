
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { AdminNotification } from "./types";

export function useNotifications() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin notifications:', error);
        toast.error("Failed to load notifications");
        throw error;
      }

      return data as AdminNotification[];
    },
  });

  const { data: authNotifications = [] } = useQuery({
    queryKey: ['auth-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auth_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching auth notifications:', error);
        return [];
      }

      return data || [];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success("Notification marked as read");
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to update notification");
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success("Notification deleted");
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
      toast.error("Failed to delete notification");
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const deleteAllReadNotifications = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('is_read', true);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success("All read notifications deleted");
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast.error("Failed to delete notifications");
    } finally {
      setIsDeleting(false);
    }
  };

  // Combine and process notifications
  const allNotifications = [
    ...notifications,
    ...authNotifications.map((n: any) => ({
      id: n.id,
      type: 'auth',
      message: n.message || 'Authentication event',
      metadata: n.metadata,
      created_at: n.created_at,
      is_read: n.is_read || false
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const readCount = allNotifications.filter(n => n.is_read).length;

  return {
    notifications: allNotifications,
    isLoading,
    error,
    readCount,
    isDeleting,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
    deleteAllReadNotifications,
    isMarkingAsRead: markAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending
  };
}
