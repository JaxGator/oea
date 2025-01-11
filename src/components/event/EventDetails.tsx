import { CalendarIcon, UsersIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";
import { useGoogleMapsToken } from "@/hooks/useGoogleMapsToken";
import { useState, useEffect } from "react";
import { LocationDisplay } from "./details/LocationDisplay";
import { AttendeeList } from "./details/AttendeeList";
import { EventMap } from "./details/EventMap";

interface EventDetailsProps {
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  description: string;
  attendeeNames: string[];
  userRSVPStatus?: string | null;
  showFullDescription?: boolean;
  waitlistNames?: string[];
}

export function EventDetails({
  date,
  time,
  location,
  rsvpCount,
  maxGuests,
  description,
  attendeeNames,
  userRSVPStatus,
  showFullDescription = false,
  waitlistNames = [],
}: EventDetailsProps) {
  const { user, profile } = useAuthState();
  const showLocation = user && profile?.is_approved;
  const isWixEvent = description === 'Imported from Wix';
  const { mapKey } = useGoogleMapsToken();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const eventDate = parseISO(date);

  useEffect(() => {
    const geocodeLocation = async () => {
      if (!showLocation || !location || !mapKey) return;
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${mapKey}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        }
      } catch (error) {
        console.error('Error geocoding location:', error);
      }
    };

    geocodeLocation();
  }, [location, mapKey, showLocation]);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm">
          {format(eventDate, "EEEE, MMMM do, yyyy")} at {formatTime(time)}
        </span>
      </div>
      
      <div className="space-y-6">
        <div>
          <LocationDisplay showLocation={showLocation} location={location} />

          <div className="flex items-center gap-2 text-gray-600 mt-4">
            <UsersIcon className="w-4 h-4" />
            <span className="text-sm">
              {isWixEvent ? (
                `${rsvpCount} attendees`
              ) : (
                `${rsvpCount} / ${maxGuests} attendees`
              )}
            </span>
          </div>

          {userRSVPStatus && (
            <Badge variant="secondary" className="mt-2">
              Your RSVP: {userRSVPStatus}
            </Badge>
          )}

          <AttendeeList attendeeNames={attendeeNames} waitlistNames={waitlistNames} />
        </div>

        {showLocation && coordinates && mapKey && (
          <EventMap mapKey={mapKey} coordinates={coordinates} />
        )}

        {description && (
          <div className={`prose prose-sm max-w-none ${showFullDescription ? '' : 'line-clamp-3'} mt-6`}>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        )}
      </div>
    </div>
  );
}