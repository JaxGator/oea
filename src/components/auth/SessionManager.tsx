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

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          await handleSessionError(error);
          return;
        }

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
          console.log('Token expiring soon, refreshing...');
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();

          if (refreshError) {
            console.error('Session refresh failed:', refreshError);
            await handleSessionError(refreshError);
            return;
          }

          if (!refreshedSession) {
            console.log('Session refresh returned no session');
            if (isProtectedRoute(location.pathname)) {
              await clearSessionData();
              navigate('/auth');
            }
            return;
          }

          console.log('Session refreshed successfully');
        }
      } catch (err) {
        console.error('Session check failed:', err);
        await handleSessionError(err as AuthError);
      }
    };

    const handleSessionError = async (error: AuthError) => {
      console.error('Session error:', error);
      await clearSessionData();
      
      toast({
        title: "Session Error",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      
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
          // Refresh the session to ensure we have the latest data
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