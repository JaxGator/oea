import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to get session",
            variant: "destructive",
          });
          if (isMounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        if (session?.user && isMounted) {
          setState((prev) => ({
            ...prev,
            session,
            user: session.user,
          }));
        } else if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!isMounted) return;

        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return state;
}