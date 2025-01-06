import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

export function useProfile(userId: string | undefined) {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: false,
    error: null
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setState({ profile: null, isLoading: false, error: null });
      return;
    }

    let isMounted = true;
    const maxRetries = 3;
    let retryCount = 0;

    const fetchProfile = async (): Promise<void> => {
      if (!isMounted) return;
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        if (isMounted) {
          setState({
            profile,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        if (retryCount < maxRetries && isMounted) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          setTimeout(fetchProfile, delay);
          return;
        }

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error as Error
          }));

          toast({
            title: "Error",
            description: "Failed to load profile. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, toast]);

  return state;
}