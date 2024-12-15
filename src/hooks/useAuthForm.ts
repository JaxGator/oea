import { useState } from "react";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await onSubmit(formState.email, formState.password);
      if (!result) {
        // If result is null, error was already handled in onSubmit
        setFormState(prev => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Auth form error:", error);
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