import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { Event, EventRSVP } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

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
            username,
            avatar_url
          ),
          event_guests (
            id,
            first_name
          )
        `)
        .eq('event_id', eventId)
        .eq('response', 'attending');

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
          username: rsvp.profiles?.username || 'Unknown User',
          avatar_url: rsvp.profiles?.avatar_url
        },
        guests: rsvp.event_guests || []
      }));

      return {
        ...eventData,
        rsvps: rsvpsWithProfiles
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
              <div className="space-y-6">
                {event.rsvps?.filter(rsvp => rsvp.response === 'attending').map(rsvp => (
                  <div key={rsvp.id} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={rsvp.profiles.avatar_url || ''} />
                        <AvatarFallback>
                          <UserCircle className="h-6 w-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {rsvp.profiles.full_name || rsvp.profiles.username}
                        </p>
                      </div>
                    </div>
                    {rsvp.guests && rsvp.guests.length > 0 && (
                      <div className="ml-8 pl-4 border-l border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Guests:</p>
                        <div className="space-y-2">
                          {rsvp.guests.map(guest => (
                            <div key={guest.id} className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  <UserCircle className="h-5 w-5 text-gray-400" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{guest.first_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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