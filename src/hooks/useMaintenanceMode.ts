import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";

export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuthState();

  useEffect(() => {
    const fetchMaintenanceMode = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'maintenance_mode')
          .single();
        
        if (error) throw error;
        
        // Only set maintenance mode if user is not an admin
        setIsMaintenanceMode(data?.value === "true" && !profile?.is_admin);
      } catch (error) {
        console.error('Error fetching maintenance mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceMode();

    // Subscribe to changes in maintenance mode
    const channel = supabase
      .channel('maintenance_mode_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_config',
          filter: 'key=eq.maintenance_mode'
        },
        (payload) => {
          // Only set maintenance mode if user is not an admin
          setIsMaintenanceMode(payload.new.value === "true" && !profile?.is_admin);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.is_admin]); // Add profile.is_admin as dependency

  return { isMaintenanceMode, isLoading, profile };
}