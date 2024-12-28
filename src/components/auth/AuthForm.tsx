import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function AuthForm() {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'USER_DELETED') {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <SupabaseAuth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#404040',
              brandAccent: '#262626',
            },
          },
        },
        className: {
          container: 'auth-container',
          button: 'auth-button',
          input: 'auth-input',
          label: 'text-sm font-medium text-gray-700',
          message: 'text-sm text-red-600',
        },
      }}
      providers={[]}
      redirectTo={`${window.location.origin}/auth/callback`}
      magicLink={false}
      onError={(error) => {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      }}
    />
  );
}