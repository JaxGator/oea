import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Event, EventRSVP } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AddToCalendar } from "@/components/event/AddToCalendar";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuthState();

  // Use useEffect to handle navigation
  useEffect(() => {
    if (!eventId) {
      navigate("/events");
    }
  }, [eventId, navigate]);

  // If no eventId, return null while the useEffect handles navigation
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
    enabled: !!eventId
  });

  if (error) {
    console.error('Error loading event:', error);
    toast.error("Failed to load event details");
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div className="bg-white rounded-lg p-6">
            <p className="text-red-500">Error loading event details. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  const showLocation = user && profile?.is_approved;
  const eventDate = parseISO(event.date);
  const isPastEvent = new Date(event.date) < new Date();
  const isWixEvent = event.description === 'Imported from Wix';

  // Format time from 24-hour to 12-hour
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const attendeeCount = event.rsvps?.filter(rsvp => rsvp.response === 'attending').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {event.image_url && (
            <div className="aspect-video w-full relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {event.is_featured && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 transform rotate-45 translate-x-8 translate-y-2">
                  Featured
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                  <span>
                    {format(eventDate, "EEEE, MMMM do, yyyy")} at {formatTime(event.time)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-5 h-5" />
                  <span>
                    {showLocation ? event.location : (
                      <span className="italic">Location visible after approval</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <UsersIcon className="w-5 h-5" />
                  <span>
                    {isWixEvent ? (
                      `${attendeeCount} attendees`
                    ) : (
                      `${attendeeCount} / ${event.max_guests} attendees`
                    )}
                  </span>
                </div>
              </div>

              {!isPastEvent && (
                <div className="mt-4">
                  <AddToCalendar
                    event={{
                      title: event.title,
                      description: event.description || "",
                      date: event.date,
                      time: event.time,
                      location: event.location,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="prose prose-sm md:prose-base max-w-none">
              <div dangerouslySetInnerHTML={{ __html: event.description || "" }} />
            </div>

            {event.rsvps && event.rsvps.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Attendees</h2>
                <div className="space-y-2">
                  {event.rsvps
                    .filter(rsvp => rsvp.response === 'attending')
                    .map(rsvp => (
                      <div key={rsvp.id} className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {rsvp.profiles.full_name || rsvp.profiles.username}
                        </span>
                        {rsvp.user_id === user?.id && (
                          <Badge variant="secondary">You</Badge>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}