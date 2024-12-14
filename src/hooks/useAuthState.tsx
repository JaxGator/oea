import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthEvent = (event: string) => {
    switch (event) {
      case "SIGNED_IN":
        toast({
          title: "Success",
          description: "You have been signed in successfully.",
        });
        navigate("/");
        break;
      case "SIGNED_OUT":
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully.",
        });
        navigate("/auth");
        break;
      case "PASSWORD_RECOVERY":
        toast({
          title: "Password Recovery",
          description: "Please check your email to reset your password.",
        });
        break;
      case "USER_UPDATED":
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      handleAuthEvent(event);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { isLoading, setIsLoading };
}