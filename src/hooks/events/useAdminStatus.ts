import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdminStatus() {
  const [state, setState] = useState({
    isAdmin: false,
    isLoading: true,
    error: null as Error | null
  });
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // If there's no user, just set isAdmin to false without showing error
        if (!user) {
          if (isMounted) {
            setState(prev => ({ ...prev, isAdmin: false, isLoading: false }));
          }
          return;
        }

        // Only proceed with admin check if we have a logged-in user
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

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
        // Only show toast for logged-in users
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isMounted) {
          toast({
            title: "Error",
            description: "Failed to verify admin status. Please try again.",
            variant: "destructive",
          });
        }
        if (isMounted) {
          setState(prev => ({
            ...prev,
            error: err as Error,
            isLoading: false
          }));
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
  }, [toast]);

  return { 
    isAdmin: state.isAdmin, 
    isLoading: state.isLoading,
    error: state.error?.message
  };
}