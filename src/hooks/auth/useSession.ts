import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    isLoading: true,
    error: null
  });
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (isMounted) {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error as Error
          }));
          toast({
            title: "Authentication Error",
            description: "Failed to initialize authentication",
            variant: "destructive",
          });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!isMounted) return;

        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
          error: null
        });
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return state;
}