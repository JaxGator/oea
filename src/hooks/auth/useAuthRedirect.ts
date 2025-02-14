
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (error.message !== "session_not_found") {
            toast({
              title: "Authentication Error",
              description: "Please try signing in again",
              variant: "destructive",
            });
          }
          return;
        }

        if (session) {
          // Get the redirect path from location state or default to home
          const state = location.state as { from?: string };
          const from = state?.from || '/';
          navigate(from);
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive",
        });
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const state = location.state as { from?: string };
        const from = state?.from || '/';
        navigate(from);
      } else if (event === 'SIGNED_OUT') {
        await supabase.auth.signOut();
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location]);
}
