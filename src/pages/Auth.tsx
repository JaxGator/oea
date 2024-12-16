import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuthState } from "@/hooks/useAuthState";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

export default function Auth() {
  const { isLoading, user } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes to catch errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    });

    // Listen for auth state changes with error handling
    const authStateSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.error) {
        handleAuthError(session.error);
      }
    });

    return () => {
      subscription.unsubscribe();
      authStateSubscription.data.subscription.unsubscribe();
    };
  }, [toast]);

  const handleAuthError = (error: AuthError) => {
    let errorMessage = "An error occurred during authentication.";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please confirm your email address before logging in.";
    } else if (error.message.includes("Email rate limit exceeded")) {
      errorMessage = "Too many attempts. Please try again later.";
    }

    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png" 
              alt="Logo" 
              className="h-16 w-auto mb-2"
            />
          </div>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0d97d1',
                    brandAccent: '#0d97d1',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
}