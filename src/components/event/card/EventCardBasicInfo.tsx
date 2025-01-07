import { CalendarDays, MapPin, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuthState } from "@/hooks/useAuthState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventCardBasicInfoProps {
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
}

export function EventCardBasicInfo({
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
}: EventCardBasicInfoProps) {
  const { user, profile } = useAuthState();
  const showLocation = user && profile?.is_approved;

  const LocationDisplay = () => {
    if (!showLocation) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center gap-2 text-gray-600"
                role="group"
                aria-label="Event location (requires approval)"
                tabIndex={0}
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
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
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event location"
        tabIndex={0}
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <span tabIndex={0}>{location}</span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event date"
        tabIndex={0}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        <span tabIndex={0}>{format(parseISO(date), "MMMM d, yyyy")}</span>
      </div>
      
      <LocationDisplay />
      
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event attendance"
        tabIndex={0}
      >
        <Users className="h-4 w-4" aria-hidden="true" />
        <span tabIndex={0}>
          {isWixEvent ? (
            "RSVPs from previous platform"
          ) : (
            `${rsvpCount} / ${maxGuests} attending`
          )}
        </span>
      </div>
    </div>
  );
}