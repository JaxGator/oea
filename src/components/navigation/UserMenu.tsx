import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/auth";

interface UserMenuProps {
  user: User | null;
  profile?: Profile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });

      // Navigate to auth page and reload to ensure clean state
      navigate('/auth');
      window.location.reload();
      
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  }, [toast, navigate, isSigningOut]);

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="gap-2">
          <UserCircle className="h-5 w-5" />
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile?.avatar_url || undefined}
              alt={profile?.full_name || user.email || "User avatar"}
            />
            <AvatarFallback>
              {profile?.full_name?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer"
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}