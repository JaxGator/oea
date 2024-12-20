import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const maxRetries = 3;
    let retryCount = 0;

    const attemptCheck = async (): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        setIsAdmin(!!data?.is_admin);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptCheck();
        }

        toast.error("Failed to verify admin status. Please refresh the page.");
        setIsLoading(false);
      }
    };

    await attemptCheck();
  };

  return { isAdmin, isLoading };
}