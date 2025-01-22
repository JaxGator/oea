import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, UserCircle } from "lucide-react";
import { Profile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface UserMenuProps {
  user: any;
  profile: Profile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscribe to messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    // Initial fetch of unread count
    fetchUnreadCount();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    setUnreadCount(count || 0);
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          variant="ghost" 
          className="text-white hover:text-primary-100 hover:bg-gray-800"
          role="menuitem"
          tabIndex={0}
        >
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4" role="menu">
      <Link
        to="/messages"
        className="relative flex items-center hover:opacity-80"
        role="menuitem"
        tabIndex={0}
      >
        <MessageSquare className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Link>
      <Link
        to="/profile"
        className="flex items-center space-x-2 hover:opacity-80"
        role="menuitem"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={profile?.avatar_url}
            alt={profile?.full_name || profile?.username || "User Avatar"}
          />
          <AvatarFallback>
            <UserCircle className="h-8 w-8 text-[#0d97d1]" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm">
          {profile?.full_name || profile?.username}
        </span>
      </Link>
      <Button
        variant="ghost"
        className="text-white hover:text-primary-100 hover:bg-gray-800"
        onClick={handleSignOut}
        role="menuitem"
        tabIndex={0}
      >
        Sign Out
      </Button>
    </div>
  );
}