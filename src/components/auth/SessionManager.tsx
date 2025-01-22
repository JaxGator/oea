import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isProtectedRoute } from "@/utils/routeConfig";
import { QueryClient } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let refreshTimer: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        // First, try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying session check (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkSession, RETRY_DELAY);
            return;
          }
          await handleSessionError(error);
          return;
        }

        // Reset retry count on successful check
        retryCount = 0;

        if (!session) {
          console.log('No active session found');
          if (isProtectedRoute(location.pathname)) {
            console.log('Protected route - redirecting to auth');
            await clearSessionData();
            navigate('/auth');
          }
          return;
        }

        // Check if token is about to expire (within 5 minutes)
        const expiresAt = session?.expires_at || 0;
        const isExpiringSoon = (expiresAt * 1000) - Date.now() < 5 * 60 * 1000;

        if (isExpiringSoon) {
          console.log('Token expiring soon, attempting refresh...');
          try {
            const { data: { session: refreshedSession }, error: refreshError } = 
              await supabase.auth.refreshSession();

            if (refreshError) {
              console.error('Session refresh failed:', refreshError);
              // Handle specific refresh token errors silently
              if (refreshError.message.includes('refresh_token_not_found') || 
                  refreshError.message.includes('Invalid Refresh Token')) {
                console.log('Invalid refresh token, clearing session...');
                await clearSessionData();
                if (isProtectedRoute(location.pathname)) {
                  navigate('/auth');
                }
                return;
              }
              await handleSessionError(refreshError);
              return;
            }

            if (!refreshedSession) {
              console.log('Session refresh returned no session');
              await clearSessionData();
              if (isProtectedRoute(location.pathname)) {
                navigate('/auth');
              }
              return;
            }

            console.log('Session refreshed successfully');
          } catch (refreshErr) {
            console.error('Session refresh failed:', refreshErr);
            await handleSessionError(refreshErr as AuthError);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retrying after error (${retryCount}/${MAX_RETRIES})...`);
          setTimeout(checkSession, RETRY_DELAY);
          return;
        }
        await handleSessionError(err as AuthError);
      }
    };

    const handleSessionError = async (error: AuthError) => {
      console.error('Session error:', error);
      await clearSessionData();
      
      // Only show toast for network errors or unexpected issues
      if (!error.message.includes('refresh_token_not_found') && 
          !error.message.includes('Invalid Refresh Token')) {
        toast({
          title: "Session Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      }
      
      if (isProtectedRoute(location.pathname)) {
        navigate('/auth');
      }
    };

    const clearSessionData = async () => {
      try {
        await supabase.auth.signOut();
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        console.log('Session data cleared');
      } catch (error) {
        console.error('Error clearing session data:', error);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out, clearing data');
          await clearSessionData();
          if (isProtectedRoute(location.pathname)) {
            navigate('/auth');
          }
          break;
          
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.id);
          if (location.pathname === '/auth') {
            navigate('/');
          }
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully');
          break;

        case 'USER_UPDATED':
          await checkSession();
          break;
      }
    });

    // Initial session check
    checkSession();

    // Set up periodic session checks (every 4 minutes)
    refreshTimer = setInterval(checkSession, 4 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(refreshTimer);
      subscription.unsubscribe();
    };
  }, [navigate, location, queryClient]);

  return <>{children}</>;
}