
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "./AuthError";
import { SupabaseAuthConfig } from "./SupabaseAuthConfig";
import { WelcomeMessage } from "./WelcomeMessage";
import { useToast } from "@/hooks/use-toast";

export function AuthForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Auth error:', { error, errorDescription });
      
      // Create a notification for the admin
      createAuthNotification({
        error,
        errorDescription,
        timestamp: new Date().toISOString()
      });
      
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

  // Function to create auth notifications in the database
  const createAuthNotification = async (details: any) => {
    try {
      const errorMessage = details.errorDescription || `Auth error: ${details.error}`;
      
      const { error } = await supabase
        .from('auth_notifications')
        .insert([{
          message: errorMessage,
          metadata: details,
          is_read: false
        }]);
        
      if (error) {
        console.error('Failed to create auth notification:', error);
      } else {
        console.log('Auth notification created successfully');
      }
    } catch (err) {
      console.error('Error creating auth notification:', err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_OUT') {
        setAuthError(null);
      }
      
      // Log sign-in attempts (successful or failed)
      if (event === 'SIGNED_IN') {
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${session?.user?.email}`,
        });
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
