import { createContext, useContext, useState } from "react";
import { Member } from "../types";
import { useToast } from "@/hooks/use-toast";

interface EditMemberContextType {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  handleSubmitError: (error: unknown) => void;
}

const EditMemberContext = createContext<EditMemberContextType | undefined>(undefined);

export function useEditMember() {
  const context = useContext(EditMemberContext);
  if (!context) {
    throw new Error("useEditMember must be used within EditMemberProvider");
  }
  return context;
}

interface EditMemberProviderProps {
  children: React.ReactNode;
}

export function EditMemberProvider({ children }: EditMemberProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitError = (error: unknown) => {
    console.error('Error submitting form:', error);
    setIsSubmitting(false);
    toast({
      title: "Error",
      description: "Failed to update member",
      variant: "destructive",
    });
  };

  return (
    <EditMemberContext.Provider 
      value={{ 
        isSubmitting, 
        setIsSubmitting,
        handleSubmitError
      }}
    >
      {children}
    </EditMemberContext.Provider>
  );
}