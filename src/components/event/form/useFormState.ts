
import { useState } from "react";
import { EventFormValues } from "../EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFormState(initialData?: any, onSuccess?: () => void) {
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const verifySession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session verification error:", error);
        return false;
      }
      
      return !!data.session;
    } catch (err) {
      console.error("Session verification failed:", err);
      return false;
    }
  };

  return {
    localSubmitting,
    setLocalSubmitting,
    verifySession
  };
}
