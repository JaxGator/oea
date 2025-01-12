import { HealthCheckResponse } from "../types";

export async function checkServiceHealth(url: string): Promise<HealthCheckResponse> {
  const startTime = performance.now();
  
  try {
    // Use a timeout to prevent long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD request instead of GET to minimize data transfer
      mode: 'no-cors', // This allows the request to succeed even with CORS restrictions
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();

    return {
      ok: true,
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