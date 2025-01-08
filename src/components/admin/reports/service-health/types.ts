export type ServiceStatus = 'healthy' | 'error';

export interface ServiceHealth {
  status: ServiceStatus;
  latency: number;
  error?: string;
}

export interface ServiceHealthStatus {
  supabase: ServiceHealth;
  netlify: ServiceHealth;
  lovable: ServiceHealth;
}

export interface HealthCheckResponse {
  ok: boolean;
  latency: number;
  error?: string;
}