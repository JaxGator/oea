
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, UserPlus } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AdminNotificationList } from "./AdminNotificationList";

export function AdminNotifications() {
  const navigate = useNavigate();
  
  const { data: unapprovedUsers = [] } = useQuery({
    queryKey: ['unapproved-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false);

      if (error) throw error;
      return data || [];
    },
  });

  const totalNotifications = unapprovedUsers.length + unreadNotifications.length;

  if (totalNotifications === 0) return null;

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
            {totalNotifications}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-4">
          {unapprovedUsers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-semibold">
                  {unapprovedUsers.length} User{unapprovedUsers.length !== 1 && 's'} Pending Approval
                </h4>
              </div>
              <Button 
                className="w-full"
                onClick={() => navigate('/admin?tab=users')}
              >
                Manage Users
              </Button>
            </div>
          )}
          {unreadNotifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Recent Notifications</h4>
              <AdminNotificationList />
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
