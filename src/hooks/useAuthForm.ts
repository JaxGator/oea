import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormState {
  email: string;
  password: string;
}

interface UseAuthFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
  setIsLoading: (loading: boolean) => void;
}

export function useAuthForm({ onSubmit, setIsLoading }: UseAuthFormProps) {
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formState.email, formState.password);
    } catch (error: any) {
      console.error("Auth form error:", error);
      // Don't show a toast since we're now handling errors in the form itself
      setFormState(prev => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    handleInputChange,
    handleSubmit,
  };
}