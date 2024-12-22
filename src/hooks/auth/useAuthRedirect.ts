import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthRedirect() {
  const navigate = useNavigate();
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
          navigate("/");
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
      console.log("Auth state change:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        await supabase.auth.signOut();
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
}