import { ReactNode, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useSessionManager } from "@/hooks/useSessionManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { isProtectedRoute } from "@/utils/routeConfig";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  useSessionManager(queryClient);

  useEffect(() => {
    let mounted = true;

    const checkInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log('No initial session found, clearing data');
        queryClient.clear();
        // Only redirect to auth if trying to access a protected route
        if (isProtectedRoute(location.pathname)) {
          navigate('/auth');
        }
        return;
      }
    };

    checkInitialSession();

    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing queries');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        // Only redirect to auth if on a protected route
        if (isProtectedRoute(location.pathname)) {
          navigate('/auth');
        }
        return;
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in, invalidating queries');
        queryClient.invalidateQueries();
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
        navigate('/');
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, invalidating queries');
        queryClient.invalidateQueries();
        return;
      }

      if (event === 'INITIAL_SESSION') {
        if (!session && isProtectedRoute(location.pathname)) {
          console.log('No initial session and protected route, redirecting to auth');
          navigate('/auth');
          return;
        }
      }
    });

    return () => {
      mounted = false;
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [queryClient, toast, navigate, location.pathname]);

  return <>{children}</>;
}