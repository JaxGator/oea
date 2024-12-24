import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Event, EventRSVP } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Return early if no eventId is provided
  if (!eventId) {
    return navigate("/events");
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
          created_at,
          profiles (
            id,
            full_name,
            username
          )
        `)
        .eq('event_id', eventId);

      if (rsvpError) throw rsvpError;

      const rsvpsWithProfiles = rsvpData?.map((rsvp): EventRSVP => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        created_at: rsvp.created_at,
        profiles: {
          id: rsvp.profiles?.id,
          full_name: rsvp.profiles?.full_name,
          username: rsvp.profiles?.username || 'Unknown User'
        }
      }));

      return {
        ...eventData,
        rsvps: rsvpsWithProfiles
      } as Event;
    },
    enabled: !!eventId // Only run query if eventId exists
  });

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
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
              <div className="space-y-2">
                {event.rsvps?.filter(rsvp => rsvp.response === 'attending').map(rsvp => (
                  <div key={rsvp.id} className="text-gray-600">
                    {rsvp.profiles.full_name || rsvp.profiles.username}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}