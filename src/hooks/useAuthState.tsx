import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, Profile } from "@/types/auth";
import { toast } from "sonner";

export function useAuthState() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    user: null,
    profile: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          user: session.user,
        }));
        fetchProfile(session.user.id);
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          user: session.user,
        }));
        fetchProfile(session.user.id);
      } else {
        setState({
          isLoading: false,
          user: null,
          profile: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        if (status === 406) {
          // Handle not found
          setState((prev) => ({
            ...prev,
            isLoading: false,
            profile: null,
          }));
          return;
        }
        throw error;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        profile: data as Profile,
      }));
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data. Please try refreshing the page.");
      setState((prev) => ({
        ...prev,
        isLoading: false,
        profile: null,
      }));
    }
  };

  return state;
}