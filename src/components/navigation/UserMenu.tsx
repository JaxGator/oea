import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Profile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserMenuProps {
  user: any;
  profile: Profile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      // Clear any stored session data first
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Navigate to auth page with state indicating user-initiated sign-out
      navigate('/auth', { state: { isUserInitiatedSignOut: true } });
      
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again or refresh the page",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  }, [toast, navigate, isSigningOut]);

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
        disabled={isSigningOut}
        role="menuitem"
        tabIndex={0}
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}