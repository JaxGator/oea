import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function AuthForm() {
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
        },
      }}
      providers={[]}
      redirectTo={`${window.location.origin}/auth/callback`}
      magicLink={false}
    />
  );
}