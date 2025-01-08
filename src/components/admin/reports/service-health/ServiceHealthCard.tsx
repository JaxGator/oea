import { Card } from "@/components/ui/card";
import { ServiceHealthStatus } from "./types";
import { AlertCircle, CheckCircle2, Wifi } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceHealthCardProps {
  serviceHealth: ServiceHealthStatus | undefined;
}

export function ServiceHealthCard({ serviceHealth }: ServiceHealthCardProps) {
  if (!serviceHealth) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Service Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceHealthItem
            name="Supabase"
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="Netlify"
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="Lovable"
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="Namecheap DNS"
            status="error"
            latency={0}
            error="Loading status..."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Service Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ServiceHealthItem
          name="Supabase"
          status={serviceHealth.supabase.status}
          latency={serviceHealth.supabase.latency}
          error={serviceHealth.supabase.error}
        />
        <ServiceHealthItem
          name="Netlify"
          status={serviceHealth.netlify.status}
          latency={serviceHealth.netlify.latency}
          error={serviceHealth.netlify.error}
        />
        <ServiceHealthItem
          name="Lovable"
          status={serviceHealth.lovable.status}
          latency={serviceHealth.lovable.latency}
          error={serviceHealth.lovable.error}
        />
        <ServiceHealthItem
          name="Namecheap DNS"
          status={serviceHealth.namecheap.status}
          latency={serviceHealth.namecheap.latency}
          error={serviceHealth.namecheap.error}
        />
      </div>
    </Card>
  );
}

interface ServiceHealthItemProps {
  name: string;
  status: 'healthy' | 'error';
  latency: number;
  error?: string;
}

function ServiceHealthItem({ name, status, latency, error }: ServiceHealthItemProps) {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <Tooltip>
            <TooltipTrigger>
              {status === 'healthy' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {status === 'healthy' ? 'Service is healthy' : error || 'Service is experiencing issues'}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-gray-400" />
          <span className={`text-sm ${latency > 1000 ? 'text-orange-600' : 'text-gray-600'}`}>
            {latency.toFixed(0)}ms
          </span>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}