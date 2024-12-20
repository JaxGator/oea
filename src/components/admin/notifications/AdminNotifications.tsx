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

  if (unapprovedUsers.length === 0) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:text-primary-100 hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unapprovedUsers.length}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-orange-500" />
            <h4 className="text-sm font-semibold">New Users Pending Approval</h4>
          </div>
          <div className="space-y-2">
            {unapprovedUsers.map((user) => (
              <div key={user.id} className="text-sm flex items-center justify-between">
                <span>{user.username}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin?tab=users')}
          >
            Manage Users
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}