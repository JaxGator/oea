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

    // Fetch profile helper function
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    };

    // Handle auth state updates
    const handleAuthStateChange = async (currentUser: User | null) => {
      if (!mounted) return;

      try {
        setUser(currentUser);
        
        if (currentUser) {
          const profileData = await fetchProfile(currentUser.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error updating auth state:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthStateChange(session?.user ?? null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleAuthStateChange(session?.user ?? null);
      }
    );

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, user, profile };
}