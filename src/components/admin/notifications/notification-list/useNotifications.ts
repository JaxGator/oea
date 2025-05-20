
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { AdminNotification } from "./types";

export function useNotifications() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications/all');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching admin notifications:', errorData);
        toast.error("Failed to load notifications");
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data as AdminNotification[];
    },
  });

  const { data: authNotifications = [] } = useQuery({
    queryKey: ['auth-notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications/auth');
      
      if (!response.ok) {
        console.error('Error fetching auth notifications:', response.statusText);
        return [];
      }
      
      return await response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
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
      const response = await fetch('/api/admin/notifications/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
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
      
      const response = await fetch('/api/admin/notifications/delete-read', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete read notifications');
      }
      
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
