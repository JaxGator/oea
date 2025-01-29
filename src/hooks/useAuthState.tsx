import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useAuthState() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(user?.id);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to profile changes
    const channel = supabase
      .channel(`public:profiles:id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile changed:', payload);
          queryClient.invalidateQueries({
            queryKey: ['profile', user.id]
          });
        }
      )
      .subscribe((status) => {
        console.log('Profile subscription status:', status);
      });

    return () => {
      console.log('Cleaning up profile subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Enhanced logging for authentication state
  console.log('useAuthState - Current state:', {
    hasUser: !!user,
    userId: user?.id,
    hasProfile: !!profile,
    isAdmin: profile?.is_admin,
    profileDetails: profile ? {
      id: profile.id,
      username: profile.username,
      isAdmin: profile.is_admin,
      isApproved: profile.is_approved
    } : null,
    isLoading: isSessionLoading || isProfileLoading,
    sessionError,
    profileError,
    timestamp: new Date().toISOString()
  });

  // Handle session errors
  useEffect(() => {
    if (sessionError) {
      console.error('Session error:', sessionError);
      toast({
        title: "Authentication Error",
        description: "Please try signing in again",
        variant: "destructive",
      });
    }
  }, [sessionError, toast]);

  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      console.error('Profile error:', profileError);
      toast({
        title: "Profile Error",
        description: "Unable to load user profile",
        variant: "destructive",
      });
    }
  }, [profileError, toast]);

  return {
    user,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError,
    isAuthenticated: !!user
  };
}