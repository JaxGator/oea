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
        
        setIsMaintenanceMode(data?.value === "true");
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
          setIsMaintenanceMode(payload.new.value === "true");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isMaintenanceMode, isLoading, profile };
}