import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      handleAuthEvent(event);
    });

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthEvent = (event: string) => {
    switch (event) {
      case "SIGNED_IN":
        toast({
          title: "Success",
          description: "You have been signed in successfully.",
        });
        navigate("/");
        break;
      case "SIGNED_OUT":
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully.",
        });
        navigate("/auth");
        break;
      case "PASSWORD_RECOVERY":
        toast({
          title: "Password Recovery",
          description: "Please check your email to reset your password.",
        });
        break;
      case "USER_UPDATED":
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        break;
      default:
        break;
    }
  };

  return { isLoading, setIsLoading, user, profile };
}