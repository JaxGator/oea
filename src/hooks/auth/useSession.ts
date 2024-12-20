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
        
        if (error) {
          // If there's an error getting the session, sign out to clear any invalid tokens
          await supabase.auth.signOut();
          throw error;
        }

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
            session: null,
            user: null,
            isLoading: false,
            error: error as Error
          }));
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === 'TOKEN_REFRESHED') {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null
          });
        } else {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null
          });
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return state;
}