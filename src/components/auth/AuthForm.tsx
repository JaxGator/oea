
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

const SEND_TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 2;
const BASE_DELAY = 1000; // Start with 1 second delay

export function AuthForm() {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const location = useLocation();

  // Reset submission state after timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isSubmitting) {
      timeoutId = setTimeout(() => {
        console.log('Request timeout reached');
        setIsSubmitting(false);
        setSubmitAttempts(0);
        toast({
          title: "Error",
          description: "Request timed out. Please try again.",
          variant: "destructive",
        });
      }, SEND_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSubmitting, toast]);

  const handleContactSubmit = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      console.log('Preventing duplicate submission');
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    const attemptSubmission = async (retry = 0): Promise<boolean> => {
      try {
        console.log(`Attempting to send message (attempt ${retry + 1}/${MAX_RETRIES + 1})`);
        
        const { data, error } = await supabase.functions.invoke('send-admin-message', {
          body: { message: trimmedMessage }
        });

        console.log('Response:', { data, error });

        if (error) {
          throw error;
        }

        if (!data?.success) {
          throw new Error(data?.error || 'Failed to send message');
        }

        toast({
          title: "Message Sent",
          description: "An administrator will respond to your message soon.",
        });

        setMessage("");
        setIsContactOpen(false);
        setSubmitAttempts(0);
        return true;

      } catch (error) {
        console.error('Send error:', error);
        
        if (retry < MAX_RETRIES) {
          const backoffDelay = BASE_DELAY * Math.pow(2, retry);
          console.log(`Retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return attemptSubmission(retry + 1);
        }

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    };

    try {
      const success = await attemptSubmission();
      if (!success) {
        console.log('All submission attempts failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [message, isSubmitting, toast]);

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
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
        <p className="text-sm text-gray-600">
          Welcome! If you previously had an account on our site, you can log in using your email and password, 
          then change it from your profile. If you are still having trouble, click below to contact an administrator.
        </p>
        <Dialog 
          open={isContactOpen} 
          onOpenChange={(open) => {
            if (!isSubmitting) {
              setIsContactOpen(open);
              if (!open) {
                setMessage("");
                setSubmitAttempts(0);
              }
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Contact Us
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Administrator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                className="w-full relative"
                onClick={handleContactSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submitAttempts > 1 ? `Retrying (${submitAttempts}/${MAX_RETRIES + 1})` : "Sending..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
