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

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            const profileData = await fetchProfile(currentUser.id);
            if (mounted) setProfile(profileData);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id).then((profileData) => {
          if (mounted) setProfile(profileData);
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, user, profile };
}