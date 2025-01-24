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
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      // Clear all queries on sign out
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing queries');
        queryClient.clear();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        navigate('/auth');
      }

      // Refresh queries on sign in
      if (event === 'SIGNED_IN') {
        console.log('User signed in, invalidating queries');
        queryClient.invalidateQueries();
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
        navigate('/');
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, invalidating queries');
        queryClient.invalidateQueries();
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [queryClient, toast, navigate]);

  return <>{children}</>;
}