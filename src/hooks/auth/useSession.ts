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
    let mounted = true;

    async function getActiveSession() {
      try {
        console.log('Fetching session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", {
            error: sessionError,
            timestamp: new Date().toISOString()
          });
          throw sessionError;
        }

        if (!mounted) return;

        if (session) {
          console.log('Session found:', {
            user: session.user.email,
            timestamp: new Date().toISOString()
          });
          setState({
            session,
            user: session.user,
            isLoading: false,
            error: null
          });
        } else {
          console.log('No active session');
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Session initialization error:", {
          error,
          timestamp: new Date().toISOString()
        });
        
        if (!mounted) return;

        setState({
          session: null,
          user: null,
          isLoading: false,
          error: error as Error
        });

        toast({
          title: "Connection Error",
          description: "Please check your internet connection and try again",
          variant: "destructive",
        });
      }
    }

    getActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state change:", {
          event,
          user: session?.user?.email,
          timestamp: new Date().toISOString()
        });

        if (event === 'SIGNED_OUT') {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null
          });
        } else if (session) {
          setState({
            session,
            user: session.user,
            isLoading: false,
            error: null
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return state;
}