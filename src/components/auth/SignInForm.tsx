import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useToast } from "@/components/ui/use-toast";

interface SignInFormProps {
  setIsLoading: (loading: boolean) => void;
}

export function SignInForm({ setIsLoading }: SignInFormProps) {
  const { toast } = useToast();
  const { formState, handleInputChange, handleSubmit } = useAuthForm({
    onSubmit: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        
        if (error.message === "Invalid login credentials") {
          throw new Error(
            "Invalid email or password. Please check your credentials and try again. If you haven't verified your email yet, please check your inbox."
          );
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please verify your email address. Check your inbox for the confirmation link."
          );
        }
        throw new Error(
          "An error occurred during sign in. Please try again later."
        );
      }

      return data;
    },
    setIsLoading,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleInputChange}
          required
          className="w-full"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleInputChange}
          required
          className="w-full"
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