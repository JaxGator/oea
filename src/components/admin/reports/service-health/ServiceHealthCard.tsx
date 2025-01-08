import { Card } from "@/components/ui/card";
import { ServiceHealthStatus } from "./types";

interface ServiceHealthCardProps {
  serviceHealth: ServiceHealthStatus | undefined;
}

export function ServiceHealthCard({ serviceHealth }: ServiceHealthCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Service Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ServiceHealthItem
          name="Supabase"
          status={serviceHealth?.supabase.status}
          latency={serviceHealth?.supabase.latency}
        />
        <ServiceHealthItem
          name="Netlify"
          status={serviceHealth?.netlify.status}
          latency={serviceHealth?.netlify.latency}
        />
      </div>
    </Card>
  );
}

interface ServiceHealthItemProps {
  name: string;
  status?: 'healthy' | 'error';
  latency?: number;
}

function ServiceHealthItem({ name, status, latency }: ServiceHealthItemProps) {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'healthy' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Latency: {latency?.toFixed(2)}ms
      </p>
    </div>
  );
}