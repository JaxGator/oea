
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { AttendeeList } from "@/components/event/details/AttendeeList";
import { useEventWithRSVPs } from "@/hooks/events/useEventWithRSVPs";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEventWithRSVPs(eventId);

  useEffect(() => {
    if (!eventId) {
      navigate("/events");
    }
  }, [eventId, navigate]);

  if (!eventId) return null;

  if (error) {
    console.error('Query error:', error);
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

  console.log('Final attendee names:', attendeeNames);

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
