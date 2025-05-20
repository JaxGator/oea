
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  created_at: string;
}

export function NotificationCenter() {
  const { toast } = useToast();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch admin logs');
      }
      
      const data = await response.json();
      return data.map((log: any): AdminNotification => ({
        id: log.id,
        message: `${log.action_type} performed on ${log.target_type}`,
        type: 'info',
        created_at: log.created_at
      }));
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_logs'
        },
        (payload) => {
          const newLog = payload.new as any;
          toast({
            title: "New Admin Action",
            description: `${newLog.action_type} performed on ${newLog.target_type}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (notifications.length === 0) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white hover:text-primary-100 hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {notifications.length}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Recent Activities</h4>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="text-sm flex items-center justify-between border-b pb-2"
                >
                  <span>{notification.message}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
