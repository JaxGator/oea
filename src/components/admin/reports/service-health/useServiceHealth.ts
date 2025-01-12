import { useQuery } from "@tanstack/react-query";
import { ServiceHealthStatus } from "./types";
import { toast } from "@/hooks/use-toast";
import { checkServiceHealth } from "./services/healthCheckService";
import { checkSupabaseHealth } from "./services/supabaseHealthCheck";
import { SERVICE_ENDPOINTS } from "./config/serviceEndpoints";

async function fetchServiceHealth(): Promise<ServiceHealthStatus> {
  try {
    // Check Supabase health
    const supabaseHealth = await checkSupabaseHealth();

    // Check other services in parallel
    const [netlifyResponse, lovableResponse, githubResponse] = await Promise.all([
      checkServiceHealth(SERVICE_ENDPOINTS.netlify),
      checkServiceHealth(SERVICE_ENDPOINTS.lovable),
      checkServiceHealth(SERVICE_ENDPOINTS.github)
    ]);

    return {
      supabase: supabaseHealth,
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
}

export function useServiceHealth() {
  return useQuery({
    queryKey: ['service-health'],
    queryFn: fetchServiceHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}