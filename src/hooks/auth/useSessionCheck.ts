
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isProtectedRoute, isValidRoute } from "@/utils/routeConfig";

export function useSessionCheck() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session for route:', location.pathname);
        
        // Don't check session for auth routes
        if (location.pathname.startsWith('/auth')) {
          return;
        }

        // Check if it's a valid route
        if (!isValidRoute(location.pathname)) {
          console.log('Invalid route, redirecting to home');
          navigate('/');
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        // Only redirect if trying to access protected route without session
        if (!session && isProtectedRoute(location.pathname)) {
          console.log('Protected route without session, redirecting to auth');
          navigate('/auth', { state: { from: location.pathname } });
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, location.pathname);
          
          if (event === 'SIGNED_OUT') {
            if (isProtectedRoute(location.pathname)) {
              navigate('/auth');
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Session check failed:', error);
        if (isProtectedRoute(location.pathname)) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate('/auth');
        }
      }
    };

    checkSession();
  }, [navigate, toast, location.pathname]);
}
