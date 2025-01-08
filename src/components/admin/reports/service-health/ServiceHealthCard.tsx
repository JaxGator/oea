import { Card } from "@/components/ui/card";
import { ServiceHealthStatus } from "./types";
import { Database, Cloud, Github } from "lucide-react";
import { ServiceHealthItem } from "./ServiceHealthItem";

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
            icon={Database}
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="Netlify"
            icon={Cloud}
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="Lovable"
            icon={Cloud}
            status="error"
            latency={0}
            error="Loading status..."
          />
          <ServiceHealthItem
            name="GitHub"
            icon={Github}
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
          icon={Database}
          status={serviceHealth.supabase.status}
          latency={serviceHealth.supabase.latency}
          error={serviceHealth.supabase.error}
        />
        <ServiceHealthItem
          name="Netlify"
          icon={Cloud}
          status={serviceHealth.netlify.status}
          latency={serviceHealth.netlify.latency}
          error={serviceHealth.netlify.error}
        />
        <ServiceHealthItem
          name="Lovable"
          icon={Cloud}
          status={serviceHealth.lovable.status}
          latency={serviceHealth.lovable.latency}
          error={serviceHealth.lovable.error}
        />
        <ServiceHealthItem
          name="GitHub"
          icon={Github}
          status={serviceHealth.github.status}
          latency={serviceHealth.github.latency}
          error={serviceHealth.github.error}
        />
      </div>
    </Card>
  );
}