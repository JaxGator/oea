import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export function AuthForm() {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        setAuthError(null);
      } else if (event === 'SIGNED_IN') {
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
        setAuthError(null);
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session?.user);
      }
    });

    // Set up error handling for auth state changes
    const handleAuthError = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth error:', error);
          setAuthError(getErrorMessage(error));
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
      }
    };

    handleAuthError();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const getErrorMessage = (error: AuthError): string => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'Email not confirmed':
          return 'Please verify your email address before signing in.';
        case 'User not found':
          return 'No account found with these credentials.';
        case 'Invalid grant':
          return 'Invalid login credentials. Please check your email and password.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="w-full max-w-md">
      {authError && (
        <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {authError}
        </div>
      )}
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
    </div>
  );
}