
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AdminNotification {
  id: string;
  type: string;
  message: string;
  metadata: any;
  created_at: string;
  is_read: boolean;
}

export function AdminNotificationList() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});

  const toggleMessageExpansion = (id: string) => {
    setExpandedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  // Get notifications from auth events as well
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

      console.log('Auth notifications loaded:', data);
      return data || [];
    },
  });

  // Combine both notification types
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

  if (isLoading) {
    return (
      <div className="text-center py-4">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load notifications
      </div>
    );
  }

  if (allNotifications.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No notifications
      </div>
    );
  }

  const readCount = allNotifications.filter(n => n.is_read).length;

  return (
    <div className="space-y-4">
      {readCount > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deleteAllReadNotifications}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Read Notifications
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-3 p-1">
          {allNotifications.map((notification) => {
            const isExpanded = expandedMessages[notification.id] || false;
            
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <Badge variant={notification.type === 'auth' ? 'secondary' : 'default'}>
                        {notification.type}
                      </Badge>
                      {!notification.is_read && (
                        <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 py-1 h-auto text-xs"
                        onClick={() => toggleMessageExpansion(notification.id)}
                      >
                        {isExpanded ? (
                          <span className="flex items-center">
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Hide Details
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show Details
                          </span>
                        )}
                      </Button>
                    </div>
                    
                    {isExpanded && notification.metadata && (
                      <div className="mt-2 text-sm bg-gray-50 p-3 rounded border text-gray-700 whitespace-pre-wrap">
                        {typeof notification.metadata === 'string' ? (
                          notification.metadata
                        ) : (
                          <pre className="overflow-auto text-xs">
                            {JSON.stringify(notification.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
