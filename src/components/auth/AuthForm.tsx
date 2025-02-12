
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function AuthForm() {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  const handleContactSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-admin-message', {
        body: { subject, message }
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "An administrator will respond to your message soon.",
      });
      setIsContactOpen(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
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
      console.log('Auth state change:', event, 'Session:', session);
      
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
      } else if (event === 'PASSWORD_RECOVERY') {
        setAuthError(null);
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions",
        });
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
            forgotten_password: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Send reset instructions',
              loading_button_label: 'Sending reset instructions...',
              link_text: "Forgot your password?",
            },
          },
        }}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
        <p className="text-sm text-gray-600">
          Welcome! If you previously had an account on our site, you can log in using your email and password="password", 
          then change it from your profile. If you are still having trouble, click below to contact an administrator.
        </p>
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
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
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleContactSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
