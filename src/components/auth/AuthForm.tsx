import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function AuthForm() {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <Auth
      supabaseClient={supabase}
      providers={["google"]}
      redirectTo={`${window.location.origin}/auth/callback`}
      appearance={{
        theme: ThemeSupa,
        style: {
          button: { background: 'rgb(59 130 246)', color: 'white' },
          anchor: { color: 'rgb(59 130 246)' },
        },
      }}
    />
  );
}