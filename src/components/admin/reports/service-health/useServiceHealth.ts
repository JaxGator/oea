import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceHealthStatus } from "./types";
import { toast } from "@/hooks/use-toast";

export function useServiceHealth() {
  return useQuery({
    queryKey: ['service-health'],
    queryFn: async (): Promise<ServiceHealthStatus> => {
      try {
        // Check Supabase connection with error handling
        const startTime = performance.now();
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .single();
        const endTime = performance.now();
        
        // Calculate actual latency
        const supabaseLatency = endTime - startTime;
        
        if (error) {
          console.error('Supabase health check error:', error);
          return {
            supabase: {
              status: 'error',
              latency: 0,
              error: error.message
            },
            netlify: {
              status: 'healthy',
              latency: 0
            }
          };
        }

        // Check Netlify status with error handling
        const netlifyStartTime = performance.now();
        const netlifyResponse = await fetch('https://www.netlifystatus.com/api/v2/status.json')
          .then(res => {
            const netlifyEndTime = performance.now();
            return {
              ok: res.ok,
              latency: netlifyEndTime - netlifyStartTime
            };
          })
          .catch(error => {
            console.error('Netlify health check error:', error);
            return {
              ok: false,
              latency: 0,
              error: error.message
            };
          });

        return {
          supabase: {
            status: 'healthy',
            latency: supabaseLatency
          },
          netlify: {
            status: netlifyResponse.ok ? 'healthy' : 'error',
            latency: netlifyResponse.latency
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
          }
        };
      }
    },
    refetchInterval: 30000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}