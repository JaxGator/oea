
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

const Auth = () => {
  useAuthRedirect();
  const { toast } = useToast();
  const location = useLocation();
  const isLogout = location.state?.logout === true;

  useEffect(() => {
    const clearSession = async () => {
      // Only clear session if this was an actual logout action
      if (!isLogout) return;

      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error clearing session:", error);
          toast({
            title: "Error",
            description: "Failed to clear previous session. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error clearing session:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    clearSession();
  }, [toast, isLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
            alt="Logo"
            className="h-16 mb-4"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>
        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
