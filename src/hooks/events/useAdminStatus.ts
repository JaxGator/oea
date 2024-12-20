import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminStatus() {
  const [state, setState] = useState({
    isAdmin: false,
    isLoading: true,
    error: null as Error | null
  });

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        // First check if we can connect to Supabase
        const { error: connectionError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
          .single();

        if (connectionError) {
          throw new Error('Unable to connect to the database');
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
          if (isMounted) {
            setState(prev => ({ ...prev, isAdmin: false, isLoading: false }));
          }
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isAdmin: !!data?.is_admin,
            error: null,
            isLoading: false
          }));
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            error: err as Error,
            isLoading: false
          }));
          toast.error("Failed to verify admin status. Please try again.");
        }
      }
    };

    // Initial check
    checkAdminStatus();

    // Set up real-time subscription for admin status changes
    const subscription = supabase
      .channel('admin-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        }, 
        (payload) => {
          if (isMounted) {
            setState(prev => ({
              ...prev,
              isAdmin: !!(payload.new as any).is_admin
            }));
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { 
    isAdmin: state.isAdmin, 
    isLoading: state.isLoading,
    error: state.error?.message
  };
}