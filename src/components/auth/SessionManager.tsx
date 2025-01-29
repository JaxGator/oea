import { ReactNode, useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);
  useSessionManager(queryClient);

  useEffect(() => {
    let mounted = true;

    const checkInitialSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            queryClient.clear();
            setIsInitialized(true);
          }
          return;
        }

        if (!session) {
          console.log('No initial session found');
          if (mounted) {
            if (isProtectedRoute(location.pathname)) {
              navigate('/auth');
            }
            setIsInitialized(true);
          }
          return;
        }

        console.log('Initial session found:', session.user.id);
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          setIsInitialized(true);
        }
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
    });

    return () => {
      mounted = false;
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [queryClient, toast, navigate, location.pathname]);

  if (!isInitialized) {
    console.log('Session manager still initializing...');
    return null;
  }

  return <>{children}</>;
}