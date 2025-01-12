import { supabase } from "@/integrations/supabase/client";
import { ServiceHealth } from "../types";

export async function checkSupabaseHealth(): Promise<ServiceHealth> {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single();

    if (error) throw error;

    const endTime = performance.now();
    return {
      status: 'healthy',
      latency: endTime - startTime
    };
  } catch (error) {
    console.error('Supabase health check error:', error);
    return {
      status: 'error',
      latency: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}