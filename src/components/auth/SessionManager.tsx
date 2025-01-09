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

        // Try to refresh the session
        try {
          console.log('Attempting to refresh session...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            if (refreshError.message.includes('refresh_token_not_found')) {
              console.log('No refresh token found - clearing session');
              await clearSessionData();
              if (isProtectedRoute(location.pathname)) {
                navigate('/auth');
              }
              return;
            }
            throw refreshError;
          }

          if (!refreshData.session) {
            console.log('Session refresh failed - no new session');
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

      } catch (err) {
        console.error('Session check failed:', err);
        await handleSessionError(err as AuthError);
      }
    };

    const handleSessionError = async (error: AuthError) => {
      console.error('Session error:', error);
      await clearSessionData();
      
      const errorMessage = error.message.includes('refresh_token_not_found') 
        ? "Your session has expired. Please sign in again."
        : "Authentication error. Please sign in again.";
      
      toast({
        title: "Session Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (isProtectedRoute(location.pathname)) {
        navigate('/auth');
      }
    };

    const clearSessionData = async () => {
      try {
        // First clear the session from Supabase
        await supabase.auth.signOut();
        
        // Then clear all local data
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
          toast({
            title: "Signed out",
            description: "You have been signed out",
          });
          break;
          
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.id);
          if (location.pathname === '/auth') {
            navigate('/');
          }
          toast({
            title: "Signed in",
            description: "Welcome back!",
          });
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully');
          break;
          
        case 'USER_UPDATED':
          console.log('User data updated');
          break;
      }
    });

    // Initial session check
    checkSession();

    // Periodic session check every 5 minutes
    const intervalId = setInterval(checkSession, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      subscription.unsubscribe();
    };
  }, [navigate, location, queryClient]);

  return <>{children}</>;
}