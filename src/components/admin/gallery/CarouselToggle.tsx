import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface CarouselToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function CarouselToggle({ enabled, onToggle }: CarouselToggleProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="gallery-carousel">Enable Gallery Carousel</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>When enabled, gallery images will automatically rotate in a carousel on the homepage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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