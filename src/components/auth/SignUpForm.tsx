import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthForm } from "@/hooks/useAuthForm";

interface SignUpFormProps {
  setIsLoading: (loading: boolean) => void;
}

export function SignUpForm({ setIsLoading }: SignUpFormProps) {
  const { toast } = useToast();
  const { formState, handleInputChange, handleSubmit } = useAuthForm({
    onSubmit: async (email, password) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
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
        Sign Up
      </Button>
    </form>
  );
}