import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface EventDetailsProps {
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  description: string;
  attendeeNames: string[];
  userRSVPStatus?: string | null;
  eventId: string;
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
  eventId,
}: EventDetailsProps) {
  const { user, profile } = useAuthState();
  const showLocation = user && profile?.is_approved;
  const isWixEvent = description === 'Imported from Wix';

  // Fetch associated photo albums
  const { data: albums } = useQuery({
    queryKey: ['eventAlbums', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      return data;
    },
  });

  // Create a Date object in local timezone
  const eventDate = new Date(`${date}T00:00:00`);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm">
          {format(eventDate, "EEEE, MMMM do, yyyy")} at {time}
        </span>
      </div>
      
      {showLocation ? (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm italic">Location visible after approval</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-gray-600">
        <UsersIcon className="w-4 h-4" />
        <span className="text-sm">
          {isWixEvent ? (
            `${rsvpCount} attendees`
          ) : (
            `${rsvpCount} / ${maxGuests} attendees`
          )}
        </span>
      </div>

      {isWixEvent && attendeeNames.length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Attending:</p>
          <p>{attendeeNames.join(', ')}</p>
        </div>
      )}
      
      <div 
        className="text-gray-600 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      
      {userRSVPStatus && (
        <Badge variant="secondary" className="mt-2">
          Your RSVP: {userRSVPStatus}
        </Badge>
      )}

      {albums && albums.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Photo Albums</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {albums.map((album) => (
              <Card key={album.id} className="p-4">
                <h4 className="font-medium">{album.title}</h4>
                {album.description && (
                  <p className="text-sm text-gray-600 mt-1">{album.description}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}