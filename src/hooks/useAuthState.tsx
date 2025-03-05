
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
    try {
      setIsAuthenticated(!!authUser);
      
      console.log("Auth state updated:", {
        isAuthenticated: !!authUser,
        userId: authUser?.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating auth state:", error);
    }
  }, [authUser]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        
        console.log("Initial auth check:", {
          hasSession: !!data.session,
          sessionId: data.session?.user?.id,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Set up subscription for profile changes
  useEffect(() => {
    if (!authUser?.id) return;

    try {
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
            console.log('Profile changed:', payload);
            queryClient.invalidateQueries({
              queryKey: ['profile', authUser.id]
            });
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up profile subscription');
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error setting up profile subscription:", error);
    }
  }, [authUser?.id, queryClient]);

  // Handle profile errors
  useEffect(() => {
    if (profileError && !profileError.message?.includes('JSON object requested, multiple (or no) rows returned')) {
      console.error('Profile error:', profileError);
    }
  }, [profileError]);

  // Handle session errors
  useEffect(() => {
    if (sessionError) {
      console.error('Session error:', sessionError);
    }
  }, [sessionError]);

  return {
    user: profile || null,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError,
    isAuthenticated
  };
}
