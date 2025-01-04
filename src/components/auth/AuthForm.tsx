import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function AuthForm() {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      } else if (event === 'SIGNED_IN') {
        toast({
          title: "Signed in",
          description: "Welcome back!",
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
          anchor: 'text-gray-700 hover:text-gray-900',
        },
      }}
      providers={['google', 'facebook']}
      redirectTo={`${window.location.origin}/auth/callback`}
      magicLink={false}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign in',
            loading_button_label: 'Signing in...',
            social_provider_text: 'Sign in with {{provider}}',
            link_text: "Already have an account? Sign in",
          },
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign up',
            loading_button_label: 'Signing up...',
            social_provider_text: 'Sign up with {{provider}}',
            link_text: "Don't have an account? Sign up",
          },
        },
      }}
    />
  );
}