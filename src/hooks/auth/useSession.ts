import { useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
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
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    async function getActiveSession() {
      try {
        console.log('Attempting to get session...', { retryCount });
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", {
            error: sessionError,
            timestamp: new Date().toISOString(),
            retryCount
          });
          
          throw sessionError;
        }

        if (!mounted) return;

        if (session) {
          console.log('Session found:', session.user.email);
          setState({
            session,
            user: session.user,
            isLoading: false,
            error: null
          });
        } else {
          console.log('No active session found');
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
          retryCount,
          timestamp: new Date().toISOString()
        });
        
        if (!mounted) return;
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying session fetch (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);
          setTimeout(getActiveSession, retryDelay * retryCount);
          return;
        }

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

        console.log("Auth state change:", event, session?.user?.email);

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