import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useGoogleMapsToken } from "@/hooks/useGoogleMapsToken";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

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
  waitlistedNames?: string[];
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
  waitlistedNames = [],
}: EventDetailsProps) {
  const { user, profile } = useAuthState();
  const showLocation = user && profile?.is_approved;
  const canViewAttendees = profile?.is_approved || profile?.is_member || profile?.is_admin;
  const isWixEvent = description === 'Imported from Wix';
  const { mapKey } = useGoogleMapsToken();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Parse the date string and create a new Date object in local timezone
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

  // Convert time from 24-hour to 12-hour format
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const LocationDisplay = () => {
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
  };

  const AttendeesList = () => {
    if (!canViewAttendees) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-600">
                <span className="italic">Attendee list visible after approval</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Please request approval to view attendee details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div className="space-y-4">
        {attendeeNames.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Confirmed Attendees ({attendeeNames.length}):</p>
            <div className="flex flex-wrap gap-2">
              {attendeeNames.map((name, index) => (
                <Badge key={index} variant="secondary">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {waitlistedNames.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Waitlist ({waitlistedNames.length}):</p>
            <div className="flex flex-wrap gap-2">
              {waitlistedNames.map((name, index) => (
                <Badge key={index} variant="outline" className="border-yellow-500">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm">
          {format(eventDate, "EEEE, MMMM do, yyyy")} at {formatTime(time)}
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="flex-1">
          <LocationDisplay />

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

          <Separator className="my-4" />
          
          <AttendeesList />
        </div>

        {showLocation && coordinates && mapKey && (
          <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden mt-4 md:mt-0">
            <LoadScript googleMapsApiKey={mapKey}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={14}
                center={coordinates}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  styles: [{ featureType: 'all', elementType: 'geometry', stylers: [{ lightness: 20 }] }],
                }}
              >
                <Marker position={coordinates} />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>
      
      {description && (
        <div className={`prose prose-sm max-w-none ${showFullDescription ? '' : 'line-clamp-3'}`}>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
      
      {userRSVPStatus && (
        <Badge variant="secondary" className="mt-2">
          Your RSVP: {userRSVPStatus}
        </Badge>
      )}
    </div>
  );
}