
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "./AuthError";
import { SupabaseAuthConfig } from "./SupabaseAuthConfig";
import { WelcomeMessage } from "./WelcomeMessage";

export function AuthForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Auth error:', { error, errorDescription });
      if (error === 'access_denied' && searchParams.get('error_code') === 'otp_expired') {
        setAuthError('The password reset link has expired. Please request a new one.');
      } else {
        setAuthError(errorDescription || 'An authentication error occurred');
      }
    }

    const handleAuthState = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    handleAuthState();
  }, [location]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_OUT') {
        setAuthError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full max-w-md">
      <AuthError error={authError} />
      <SupabaseAuthConfig />
      <WelcomeMessage />
    </div>
  );
}
