import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceHealthStatus } from "./types";

export function useServiceHealth() {
  return useQuery({
    queryKey: ['service-health'],
    queryFn: async (): Promise<ServiceHealthStatus> => {
      // Check Supabase connection
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      const supabaseHealth = !error;
      
      // Check Netlify status
      const netlifyHealth = await fetch('https://www.netlifystatus.com/api/v2/status.json')
        .then(res => res.ok)
        .catch(() => false);

      return {
        supabase: {
          status: supabaseHealth ? 'healthy' : 'error',
          latency: Math.random() * 100, // This would be real latency in ms
        },
        netlify: {
          status: netlifyHealth ? 'healthy' : 'error',
          latency: Math.random() * 50, // This would be real latency in ms
        }
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}