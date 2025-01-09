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
          handleSessionError(error);
          return;
        }

        if (!session && isProtectedRoute(location.pathname)) {
          console.log('No active session, redirecting to auth');
          clearSessionData();
          navigate('/auth');
          return;
        }

      } catch (err) {
        console.error('Session check failed:', err);
        handleSessionError(err as AuthError);
      }
    };

    const handleSessionError = (error: AuthError) => {
      clearSessionData();
      toast({
        title: "Session Error",
        description: "Please sign in again",
        variant: "destructive",
      });
      
      if (isProtectedRoute(location.pathname)) {
        navigate('/auth');
      }
    };

    const clearSessionData = () => {
      queryClient.clear();
      localStorage.clear();
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out, clearing data');
          clearSessionData();
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