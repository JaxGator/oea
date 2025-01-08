import { AlertCircle, CheckCircle2, Wifi } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ServiceHealth } from "./types";

interface ServiceHealthItemProps {
  name: string;
  icon: React.ElementType;
  status: ServiceHealth["status"];
  latency: number;
  error?: string;
}

export function ServiceHealthItem({ name, icon: Icon, status, latency, error }: ServiceHealthItemProps) {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
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