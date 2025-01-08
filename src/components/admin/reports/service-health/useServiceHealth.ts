import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceHealthStatus, HealthCheckResponse } from "./types";
import { toast } from "@/hooks/use-toast";

async function checkServiceHealth(url: string): Promise<HealthCheckResponse> {
  const startTime = performance.now();
  try {
    const response = await fetch(url);
    const endTime = performance.now();
    return {
      ok: response.ok,
      latency: endTime - startTime
    };
  } catch (error) {
    console.error(`Health check error for ${url}:`, error);
    return {
      ok: false,
      latency: 0,
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

export function useServiceHealth() {
  return useQuery({
    queryKey: ['service-health'],
    queryFn: async (): Promise<ServiceHealthStatus> => {
      try {
        // Check Supabase connection
        const startTime = performance.now();
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .single();
        const endTime = performance.now();
        const supabaseLatency = endTime - startTime;

        if (error) {
          throw error;
        }

        // Check other services
        const [netlifyResponse, lovableResponse, githubResponse] = await Promise.all([
          checkServiceHealth('https://www.netlifystatus.com/api/v2/status.json'),
          checkServiceHealth('https://api.lovable.dev/health'),
          checkServiceHealth('https://www.githubstatus.com/api/v2/status.json')
        ]);

        return {
          supabase: {
            status: 'healthy',
            latency: supabaseLatency
          },
          netlify: {
            status: netlifyResponse.ok ? 'healthy' : 'error',
            latency: netlifyResponse.latency,
            error: netlifyResponse.error
          },
          lovable: {
            status: lovableResponse.ok ? 'healthy' : 'error',
            latency: lovableResponse.latency,
            error: lovableResponse.error
          },
          github: {
            status: githubResponse.ok ? 'healthy' : 'error',
            latency: githubResponse.latency,
            error: githubResponse.error
          }
        };
      } catch (error) {
        console.error('Service health check error:', error);
        toast({
          title: "Service Health Check Error",
          description: "Unable to check service health status",
          variant: "destructive",
        });
        
        return {
          supabase: {
            status: 'error',
            latency: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          netlify: {
            status: 'error',
            latency: 0,
            error: 'Connection failed'
          },
          lovable: {
            status: 'error',
            latency: 0,
            error: 'Connection failed'
          },
          github: {
            status: 'error',
            latency: 0,
            error: 'Connection failed'
          }
        };
      }
    },
    refetchInterval: 30000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}