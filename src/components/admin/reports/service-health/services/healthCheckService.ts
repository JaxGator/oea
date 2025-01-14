import { HealthCheckResponse } from "../types";
import { getServiceUrl } from "../config/serviceEndpoints";

export async function checkServiceHealth(url: string): Promise<HealthCheckResponse> {
  const startTime = performance.now();
  
  try {
    // Use a timeout to prevent long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const formattedUrl = getServiceUrl(url);
    
    // Validate URL before making request
    if (!formattedUrl || !formattedUrl.startsWith('http')) {
      throw new Error('Invalid URL format');
    }

    const response = await fetch(formattedUrl, {
      method: 'HEAD',
      mode: 'no-cors', // This allows the request to succeed even with CORS restrictions
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();

    // With no-cors mode, we won't get a proper status code
    // but if we get here without throwing, the service is reachable
    return {
      ok: true,
      latency: endTime - startTime
    };
  } catch (error) {
    console.error('Health check error:', error);
    // If we get here, the service is either down or unreachable
    return {
      ok: false,
      latency: 0,
      error: error instanceof Error 
        ? `Service unreachable: ${error.message}`
        : 'Service unreachable'
    };
  }
}