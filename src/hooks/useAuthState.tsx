import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuthState() {
  const { user, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile
  } = useProfile(user?.id);
  const queryClient = useQueryClient();

  // Prefetch profile data when user is authenticated
  useEffect(() => {
    if (user?.id) {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      refetchProfile();
      
      // Also invalidate members list if it exists
      queryClient.invalidateQueries({ queryKey: ['members'] });
    }
  }, [user?.id, queryClient, refetchProfile]);

  return {
    user,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError,
    isAuthenticated: !!user
  };
}