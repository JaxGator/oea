import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

type MaintenanceModeProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isLoading?: boolean;
};

export function MaintenanceMode({ enabled, onToggle, isLoading }: MaintenanceModeProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-12" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Maintenance Mode</label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
        />
        <span className="text-sm text-gray-500">
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  );
}