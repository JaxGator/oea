
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ActionFeedbackOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

export function useActionFeedback() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const executeAction = useCallback(async <T>(
    actionFn: () => Promise<T>,
    options: ActionFeedbackOptions = {}
  ): Promise<T | undefined> => {
    const {
      successMessage = "Action completed successfully",
      errorMessage = "Action failed. Please try again.",
      loadingMessage
    } = options;
    
    setIsLoading(true);
    
    if (loadingMessage) {
      toast.loading(loadingMessage);
    }
    
    try {
      const result = await actionFn();
      toast.success(successMessage);
      return result;
    } catch (error) {
      console.error("Action failed:", error);
      
      // Get a more specific error message if available
      const message = error instanceof Error 
        ? error.message 
        : errorMessage;
        
      toast.error(message);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    executeAction
  };
}
