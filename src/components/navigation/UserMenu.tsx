import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Profile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

interface UserMenuProps {
  user: any;
  profile: Profile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="ghost" className="text-white hover:text-primary-100">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/profile"
        className="flex items-center space-x-2 hover:opacity-80"
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
        className="text-white hover:text-primary-100"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}