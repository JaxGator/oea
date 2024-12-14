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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error(
            "Invalid email or password. If you just signed up, please check your email for verification."
          );
        }
        throw error;
      }
    },
    setIsLoading,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formState.email}
        onChange={handleInputChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formState.password}
        onChange={handleInputChange}
        required
      />
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}