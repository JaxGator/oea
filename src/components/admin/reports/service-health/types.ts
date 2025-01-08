export interface ServiceHealthStatus {
  supabase: {
    status: 'healthy' | 'error';
    latency: number;
  };
  netlify: {
    status: 'healthy' | 'error';
    latency: number;
  };
}