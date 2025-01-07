import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface CarouselToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function CarouselToggle({ enabled, onToggle }: CarouselToggleProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="gallery-carousel">Enable Gallery Carousel</Label>
          <Switch
            id="gallery-carousel"
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
}