
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isProtectedRoute } from "@/utils/routeConfig";

export function useSessionCheck() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // Skip check for auth routes
        if (location.pathname.startsWith('/auth')) {
          return;
        }

        console.log('Checking session for route:', location.pathname);

        // Only check session for protected routes
        if (!isProtectedRoute(location.pathname)) {
          console.log('Public route, skipping session check');
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session && mounted) {
          console.log('No session for protected route, redirecting to auth');
          navigate('/auth', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted && isProtectedRoute(location.pathname)) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate('/auth', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' && isProtectedRoute(location.pathname)) {
        navigate('/auth');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);
}
