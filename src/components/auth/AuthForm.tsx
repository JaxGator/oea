
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "./AuthError";
import { SupabaseAuthConfig } from "./SupabaseAuthConfig";
import { WelcomeMessage } from "./WelcomeMessage";

export function AuthForm() {
  const { toast } = useToast();
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
        toast({
          title: "Link Expired",
          description: "The password reset link has expired. Please request a new one.",
          variant: "destructive",
        });
      } else {
        setAuthError(errorDescription || 'An authentication error occurred');
      }
    }

    const handleAuthState = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          toast({
            title: "Authentication Successful",
            description: "You have been signed in successfully.",
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    handleAuthState();
  }, [location, toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="w-full max-w-md">
      <AuthError error={authError} />
      <SupabaseAuthConfig />
      <WelcomeMessage />
    </div>
  );
}
