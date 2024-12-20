import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
}

export function useProfile(userId: string | undefined) {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: !!userId,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setState({ profile: null, isLoading: false });
      return;
    }

    let isMounted = true;
    const maxRetries = 3;
    let retryCount = 0;

    const fetchProfile = async (): Promise<void> => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;

        if (isMounted) {
          setState({
            profile,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        if (retryCount < maxRetries && isMounted) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchProfile();
        }

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
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