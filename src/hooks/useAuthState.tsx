import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile, AuthState } from "@/types/auth";

export function useAuthState(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        
        return data as Profile;
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        return null;
      }
    };

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initialize:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, user, profile };
}