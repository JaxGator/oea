import { MapPinIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationDisplayProps {
  showLocation: boolean;
  location: string;
}

export function LocationDisplay({ showLocation, location }: LocationDisplayProps) {
  if (!showLocation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm italic">Location visible after approval</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please log in and request approval to view event locations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <MapPinIcon className="w-4 h-4" />
      <span className="text-sm">{location}</span>
    </div>
  );
}