import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface GallerySettingsProps {
  carouselEnabled: boolean;
  carouselInterval: number;
  onSave: (settings: { carouselEnabled: boolean; carouselInterval: number }) => void;
}

export function GallerySettings({ 
  carouselEnabled = false, 
  carouselInterval = 5000,
  onSave 
}: GallerySettingsProps) {
  const [enabled, setEnabled] = useState(carouselEnabled);
  const [interval, setInterval] = useState(carouselInterval);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Gallery Settings</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Carousel Mode</Label>
          <p className="text-sm text-muted-foreground">
            Enable automatic slideshow for the gallery
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Slide Interval (seconds)</Label>
        <Input
          type="number"
          min="1"
          max="60"
          value={interval / 1000}
          onChange={(e) => setInterval(Number(e.target.value) * 1000)}
          disabled={!enabled}
        />
      </div>

      <Button 
        onClick={() => onSave({ 
          carouselEnabled: enabled, 
          carouselInterval: interval 
        })}
      >
        Save Gallery Settings
      </Button>
    </div>
  );
}