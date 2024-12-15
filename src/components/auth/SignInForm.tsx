import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useAuthEventHandler } from "@/hooks/useAuthEventHandler";

interface SignInFormProps {
  setIsLoading: (loading: boolean) => void;
}

export function SignInForm({ setIsLoading }: SignInFormProps) {
  const [error, setError] = useState<string | null>(null);
  const handleAuthEvent = useAuthEventHandler();
  
  const { formState, handleInputChange, handleSubmit } = useAuthForm({
    onSubmit: async (email, password) => {
      setError(null);
      
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please check your credentials and try again.");
            return null;
          }
          
          if (signInError.message.includes("Email not confirmed")) {
            setError("Please verify your email address before signing in.");
            return null;
          }
          
          setError("An error occurred during sign in. Please try again later.");
          console.error("Sign in error:", signInError);
          return null;
        }

        // Trigger the SIGNED_IN event handler
        handleAuthEvent("SIGNED_IN");
        return data;
      } catch (error: any) {
        console.error("Unexpected error during sign in:", error);
        setError("An unexpected error occurred. Please try again later.");
        return null;
      }
    },
    setIsLoading,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleInputChange}
          required
          className="w-full"
          autoComplete="email"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleInputChange}
          required
          className="w-full"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
      <p className="text-sm text-gray-500 text-center mt-4">
        Don't have an account? Switch to the Sign Up tab above.
      </p>
    </form>
  );
}