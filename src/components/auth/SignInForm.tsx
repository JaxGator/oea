import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface SignInFormProps {
  setIsLoading: (loading: boolean) => void;
}

export function SignInForm({ setIsLoading }: SignInFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const { formState, handleInputChange, handleSubmit } = useAuthForm({
    onSubmit: async (email, password) => {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
          return;
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address. Check your inbox for the confirmation link.");
          return;
        }
        setError("An error occurred during sign in. Please try again later.");
        return;
      }

      return data;
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