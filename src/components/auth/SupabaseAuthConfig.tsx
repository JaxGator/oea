
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function SupabaseAuthConfig() {
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
      providers={[]}
      redirectTo={`${window.location.origin}/auth/callback`}
      magicLink={false}
    />
  );
}
