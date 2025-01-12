import { HealthCheckResponse } from "../types";

export async function checkServiceHealth(url: string): Promise<HealthCheckResponse> {
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