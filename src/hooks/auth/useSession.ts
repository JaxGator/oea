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
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!mounted) return;

        if (session) {
          setState({
            session,
            user: session.user,
            isLoading: false,
            error: null
          });
        } else {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (!mounted) return;
        
        setState({
          session: null,
          user: null,
          isLoading: false,
          error: error as Error
        });

        // Only show toast for non-session_not_found errors
        if ((error as any)?.message !== "session_not_found") {
          toast({
            title: "Session Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          // Clear any invalid session data
          await supabase.auth.signOut();
        }
      }
    }

    getActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state change:", event, session);

        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
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