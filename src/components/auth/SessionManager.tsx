import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isProtectedRoute } from "@/utils/routeConfig";
import { QueryClient } from "@tanstack/react-query";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying session check (${retryCount}/${maxRetries})...`);
            setTimeout(checkSession, retryDelay * retryCount);
            return;
          }
          
          queryClient.clear();
          localStorage.clear();
          if (isProtectedRoute(location.pathname)) {
            navigate('/auth');
          }
          throw error;
        }

        if (!session && isProtectedRoute(location.pathname)) {
          console.log('No active session, redirecting protected route to auth');
          navigate('/auth');
        }

        // Reset retry count on successful check
        retryCount = 0;
      } catch (err) {
        console.error('Session check failed:', err);
        toast({
          title: "Connection Error",
          description: "Failed to verify your session. Please check your connection and try again.",
          variant: "destructive",
        });
        
        if (isProtectedRoute(location.pathname)) {
          navigate('/auth');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing data and redirecting');
        queryClient.clear();
        localStorage.clear();
        if (isProtectedRoute(location.pathname)) {
          navigate('/auth');
        }
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        if (location.pathname === '/auth') {
          navigate('/');
        }
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location, queryClient]);

  return <>{children}</>;
}