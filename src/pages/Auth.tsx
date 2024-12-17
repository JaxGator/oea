import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export default function Auth() {
  const { toast } = useToast();
  const redirectTo = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_IN') {
        console.log("Sign in session:", session);
      }
      if (event === 'SIGNED_OUT') {
        console.log("Sign out session:", session);
      }
    });

    const handleAuthError = (error: AuthError) => {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    };

    const authChangeSubscription = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        handleAuthError(new AuthError("User signed out or deleted"));
      }
    });

    return () => {
      subscription.unsubscribe();
      authChangeSubscription.data.subscription.unsubscribe();
    };
  }, [toast]);

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
            redirectTo={redirectTo}
          />
        </CardContent>
      </Card>
    </div>
  );
}