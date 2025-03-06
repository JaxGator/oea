
import { useState } from "react";
import { EventFormValues } from "../EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFormState(initialData?: any, onSuccess?: () => void) {
  const [localSubmitting, setLocalSubmitting] = useState(false);

  // Session verification is not necessary for viewing event details
  const verifySession = async () => {
    return true;
  };

  return {
    localSubmitting,
    setLocalSubmitting,
    verifySession
  };
}
