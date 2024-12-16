import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      // First, fetch the event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Then, fetch the RSVPs and associated profiles
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('id, response, user_id')
        .eq('event_id', eventId);

      if (rsvpError) throw rsvpError;

      // If there are RSVPs, fetch the associated profiles
      if (rsvpData && rsvpData.length > 0) {
        const userIds = rsvpData.map(rsvp => rsvp.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combine the RSVP data with profile information
        const rsvpsWithProfiles = rsvpData.map(rsvp => ({
          ...rsvp,
          profiles: profilesData?.find(profile => profile.id === rsvp.user_id) || {
            full_name: null,
            username: 'Unknown User'
          }
        }));

        return {
          ...eventData,
          rsvps: rsvpsWithProfiles
        } as Event;
      }

      return {
        ...eventData,
        rsvps: []
      } as Event;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Event not found</div>
      </div>
    );
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