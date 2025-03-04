
import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Profile } from "@/types/auth";

interface AuthState {
  user: Profile | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export function useAuthState(): AuthState {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(authUser?.id);
  
  // Add explicit state tracking for authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Update authentication state whenever authUser changes
  useEffect(() => {
    const authState = !!authUser;
    setIsAuthenticated(authState);
    
    console.log("Auth state updated:", {
      isAuthenticated: authState,
      userId: authUser?.id,
      timestamp: new Date().toISOString()
    });
  }, [authUser]);

  // Force refresh of authentication state on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      
      console.log("Initial auth check:", {
        hasSession,
        sessionId: data.session?.user?.id, // Fixed: access user.id instead of session.id
        timestamp: new Date().toISOString()
      });
      
      setIsAuthenticated(hasSession);
    };
    
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!authUser?.id) return;

    const channel = supabase
      .channel(`public:profiles:id=eq.${authUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${authUser.id}`
        },
        (payload) => {
          console.log('Profile changed:', {
            payload,
            timestamp: new Date().toISOString()
          });
          queryClient.invalidateQueries({
            queryKey: ['profile', authUser.id]
          });
        }
      )
      .subscribe((status) => {
        console.log('Profile subscription status:', {
          status,
          timestamp: new Date().toISOString()
        });
      });

    return () => {
      console.log('Cleaning up profile subscription');
      supabase.removeChannel(channel);
    };
  }, [authUser?.id, queryClient]);

  // Enhanced error handling for profile errors
  useEffect(() => {
    if (profileError) {
      // Skip showing error for expected "no profile" cases
      if (!profileError.message?.includes('JSON object requested, multiple (or no) rows returned')) {
        console.error('Profile error:', {
          error: profileError,
          timestamp: new Date().toISOString()
        });
        toast({
          title: "Profile Error",
          description: "Unable to load user profile",
          variant: "destructive",
        });
      }
    }
  }, [profileError, toast]);

  // Enhanced error handling for session errors
  useEffect(() => {
    if (sessionError) {
      console.error('Session error:', {
        error: sessionError,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Authentication Error",
        description: "Please try signing in again",
        variant: "destructive",
      });
    }
  }, [sessionError, toast]);

  // Debug logging
  useEffect(() => {
    console.log('useAuthState - Current state:', {
      isAuthenticated,
      userId: authUser?.id,
      hasProfile: !!profile,
      profileError,
      isAdmin: profile?.is_admin,
      profileLoading: isProfileLoading,
      sessionLoading: isSessionLoading,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, authUser, profile, profileError, isProfileLoading, isSessionLoading]);

  return {
    user: profile || null,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError,
    isAuthenticated
  };
}
