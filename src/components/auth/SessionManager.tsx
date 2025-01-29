import { ReactNode, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useSessionManager } from "@/hooks/useSessionManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  useSessionManager(queryClient);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log('No initial session found, clearing data');
        queryClient.clear();
        navigate('/auth');
        return;
      }
    };

    checkInitialSession();

    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted, clearing queries');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        navigate('/auth');
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

      // Handle session recovery
      if (event === 'INITIAL_SESSION') {
        if (!session) {
          console.log('No initial session, redirecting to auth');
          navigate('/auth');
          return;
        }
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [queryClient, toast, navigate]);

  return <>{children}</>;
}