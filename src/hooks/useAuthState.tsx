import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, Profile } from "@/types/auth";

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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        profile: data as Profile,
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return state;
}