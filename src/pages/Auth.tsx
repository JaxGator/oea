import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuthState } from "@/hooks/useAuthState";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Auth() {
  const { isLoading, user } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === 'SIGNED_IN') {
        if (session) {
          toast({
            title: "Signed in",
            description: "You have been successfully signed in.",
          });
        } else {
          toast({
            title: "Authentication Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        }
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      } else if (event === 'SIGNED_UP') {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png" 
              alt="Logo" 
              className="h-16 w-auto mb-2"
            />
          </div>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0d97d1',
                    brandAccent: '#0d97d1',
                  },
                },
              },
              style: {
                button: { width: '100%' },
                anchor: { color: '#0d97d1' },
                message: { color: 'red' },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
}