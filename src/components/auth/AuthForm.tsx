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
              brand: '#0EA5E9',
              brandAccent: '#0284C7',
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
      providers={['google']}
      redirectTo={window.location.origin + '/auth/callback'}
      view="sign_in"
      showLinks={true}
      appearance={{
        extend: true,
        className: {
          container: 'w-full',
          label: 'text-gray-700',
          input: 'rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          button: 'w-full',
        },
      }}
    />
  );
}