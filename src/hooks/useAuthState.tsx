import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile, AuthState } from "@/types/auth";

export function useAuthState(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const updateAuthState = async (currentUser: User | null) => {
      if (!mounted) return;

      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id);
        if (mounted) {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
    };

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await updateAuthState(session?.user ?? null);
      } catch (error) {
        console.error("Error in initialization:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await updateAuthState(session?.user ?? null);
      }
    );

    initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, user, profile };
}