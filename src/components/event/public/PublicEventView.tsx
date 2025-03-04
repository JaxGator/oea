
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { EventDetails } from "@/components/event/EventDetails";
import { toast } from "sonner";
import { formatEventDate, formatEventTime } from "@/utils/dateUtils";

export function PublicEventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log("PublicEventView initialized with ID:", id);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['public-event', id],
    queryFn: async () => {
      if (!id) {
        toast.error("No event ID provided");
        throw new Error('No event ID provided');
      }
      
      console.log('Fetching public event data for ID:', id);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (eventError) {
        console.error('Error fetching event:', eventError);
        toast.error("Error loading event");
        throw eventError;
      }
      
      if (!eventData) {
        console.error('Event not found or not published:', id);
        toast.error("Event not found or not published");
        throw new Error('Event not found or not published');
      }

      console.log('Successfully fetched public event data:', eventData);
      return eventData as Event;
    },
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0     // Don't cache the data
  });

  if (error) {
    console.error('Public event view error:', error);
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
          <Button
            variant="ghost"
            className="text-black mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center py-8">
            <p className="text-red-500">Event not found or not published</p>
          </div>
        </div>
      </div>
    );
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
    return (
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
          <Button
            variant="ghost"
            className="text-black mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center py-8">
            <p>Event not found or not published</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = formatEventDate(event.date, event.time);
  const formattedTime = formatEventTime(event.date, event.time);

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          className="text-white mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
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
                  {formattedDate} at {formattedTime}
                </p>
                <p>{event.location}</p>
              </div>
            </div>

            <div 
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description || "" }}
            />

            <EventDetails event={event} />

            <div className="border-t pt-6">
              <p className="text-sm text-gray-500">
                Sign in to RSVP and see who else is attending
              </p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/auth', { state: { from: `/events/${event.id}` } })}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
