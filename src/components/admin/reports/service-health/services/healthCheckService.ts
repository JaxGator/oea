import { supabase } from "@/integrations/supabase/client";
import { HealthCheckResponse } from "../types";

export async function checkServiceHealth(url: string): Promise<HealthCheckResponse> {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.functions.invoke('service-status');
    
    if (error) throw error;

    const endTime = performance.now();
    const latency = endTime - startTime;

    // Map the service URL to the corresponding status data
    if (url.includes('github')) {
      return {
        ok: data.github.status === 'healthy',
        latency,
        error: data.github.error
      };
    } else if (url.includes('netlify')) {
      return {
        ok: data.netlify.status === 'healthy',
        latency,
        error: data.netlify.error
      };
    } else if (url.includes('lovable')) {
      return {
        ok: data.lovable.status === 'healthy',
        latency,
        error: data.lovable.error
      };
    }

    return {
      ok: false,
      latency: 0,
      error: 'Unknown service'
    };
  } catch (error) {
    console.error('Health check error:', error);
    return {
      ok: false,
      latency: 0,
      error: error instanceof Error ? error.message : 'Service check failed'
    };
  }
}