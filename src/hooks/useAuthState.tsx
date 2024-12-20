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
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          toast.error("Failed to get session");
          if (isMounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        if (session?.user && isMounted) {
          setState((prev) => ({
            ...prev,
            user: session.user,
          }));
          fetchProfile(session.user.id);
        } else if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
        toast.error("Failed to initialize authentication");
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

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
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    const attemptFetch = async (): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

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
        lastError = error as Error;
        
        if (retryCount < maxRetries) {
          retryCount++;
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptFetch();
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        // Only show toast error if all retries failed
        if (retryCount === maxRetries) {
          toast.error("Failed to load profile. Please try refreshing the page.");
        }
      }
    };

    await attemptFetch();
  };

  return state;
}