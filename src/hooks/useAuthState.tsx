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

    async function initialize() {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        if (!mounted) return;

        // Update user state
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // Fetch profile if we have a user
        if (currentUser) {
          const profileData = await fetchProfile(currentUser.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    // Initialize auth state
    initialize();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const profileData = await fetchProfile(currentUser.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      }
    );

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, user, profile };
}