import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAuthState() {
  const { user, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { profile, isLoading: isProfileLoading, error: profileError } = useProfile(user?.id);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionError) {
      console.error('Session error:', sessionError);
      toast({
        title: "Authentication Error",
        description: "There was a problem with your session. Please try signing in again.",
        variant: "destructive",
      });
    }
  }, [sessionError, toast]);

  // Add debug logging
  useEffect(() => {
    console.log('Auth State:', {
      user,
      profile,
      isSessionLoading,
      isProfileLoading,
      sessionError,
      profileError
    });
  }, [user, profile, isSessionLoading, isProfileLoading, sessionError, profileError]);

  return {
    user,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError,
    isAuthenticated: !!user
  };
}