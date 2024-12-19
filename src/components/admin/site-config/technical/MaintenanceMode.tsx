import React from 'react';
import { Switch } from "@/components/ui/switch";

type MaintenanceModeProps = {
  enabled: boolean;
  onChange: (checked: boolean) => void;
};

export function MaintenanceMode({ enabled, onChange }: MaintenanceModeProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Maintenance Mode</label>
      <div className="flex items-center gap-2">
        <Switch
          checked={enabled}
          onCheckedChange={onChange}
        />
        <span className="text-sm text-muted-foreground">
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
}