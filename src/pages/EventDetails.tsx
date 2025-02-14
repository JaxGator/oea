
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Event, EventRSVP } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { AttendeeList } from "@/components/event/details/AttendeeList";

interface RSVPWithProfile {
  id: string;
  event_id: string;
  user_id: string;
  response: 'attending' | 'not_attending' | 'maybe';
  status: 'confirmed' | 'waitlisted';
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string;
  };
  event_guests?: {
    id: string;
    first_name: string;
  }[];
}

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId) {
      navigate("/events");
    }
  }, [eventId, navigate]);

  if (!eventId) {
    return null;
  }

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');

      const { data: rsvpData, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          event_id,
          user_id,
          response,
          status,
          created_at,
          profiles (
            full_name,
            username
          ),
          event_guests (
            id,
            first_name
          )
        `)
        .eq('event_id', eventId);

      if (rsvpError) throw rsvpError;

      const typedRsvpData = rsvpData as unknown as RSVPWithProfile[];
      
      const rsvpsWithProfiles = typedRsvpData?.map((rsvp): EventRSVP => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        status: rsvp.status,
        created_at: rsvp.created_at,
        profiles: {
          full_name: rsvp.profiles.full_name,
          username: rsvp.profiles.username
        },
        event_guests: rsvp.event_guests?.map(guest => ({
          id: guest.id,
          first_name: guest.first_name
        }))
      }));

      return {
        ...eventData,
        rsvps: rsvpsWithProfiles
      } as Event;
    },
    enabled: !!eventId
  });

  if (error) {
    throw error;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading event details...</span>
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    throw new Error('Event not found');
  }

  const attendeeNames = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .map(rsvp => ({
      name: rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown',
      guests: rsvp.event_guests?.map(guest => guest.first_name) || []
    }))
    .flatMap(({name, guests}) => [
      name,
      ...guests.map(guestName => `${guestName} (Guest of ${name})`)
    ]) || [];

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          className="text-white mb-4"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="bg-white rounded-lg overflow-hidden">
          {event.image_url && (
            <div className="aspect-video w-full relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="text-gray-600 space-y-2">
                <p>
                  {format(new Date(event.date), "EEEE, MMMM do, yyyy")} at {event.time}
                </p>
                <p>{event.location}</p>
              </div>
            </div>

            <div 
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description || "" }}
            />

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Attendees</h2>
              <AttendeeList attendeeNames={attendeeNames} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
