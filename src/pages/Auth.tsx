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
      if (event === 'USER_UPDATED') {
        console.log("User updated:", session);
      }
      // Handle authentication errors
      if (event === 'USER_DELETED') {
        toast({
          title: "Authentication Error",
          description: "User account not found",
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
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
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}