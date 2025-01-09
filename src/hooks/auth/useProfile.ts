import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log('useProfile - No userId provided, skipping fetch');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('useProfile - Fetching profile for userId:', userId);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error('useProfile - Error fetching profile:', error);
          setError(error);
          toast({
            title: "Error loading profile",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          return;
        }

        console.log('useProfile - Profile data:', data);
        setProfile(data);
        
        // Log admin status for debugging
        if (data) {
          console.log('useProfile - Admin status:', {
            userId,
            isAdmin: data.is_admin,
            profile: data
          });
        }

      } catch (err) {
        console.error('useProfile - Unexpected error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, toast]);

  return {
    profile,
    isLoading,
    error
  };
}