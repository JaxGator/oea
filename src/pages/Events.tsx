import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { EventCard } from "@/components/EventCard";
import { DateFilter } from "@/components/DateFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export default function Events() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our Event type
      return data.map(event => ({
        ...event,
        maxAttendees: event.max_guests,
        imageUrl: event.image_url
      })) as Event[];
    }
  });

  const { data: isAdmin = false } = useQuery({
    queryKey: ['userAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return !!data?.is_admin;
    }
  });

  const filteredEvents = selectedDate
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : events;

  const handleEventCreated = () => {
    refetch();
  };

  const handleRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('event_rsvps')
      .insert({
        event_id: eventId,
        user_id: user.id,
        response: 'attending'
      });

    if (!error) {
      refetch();
    }
  };

  const handleCancelRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .match({ event_id: eventId, user_id: user.id });

    if (!error) {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          {isAdmin && (
            <Button onClick={() => setIsCreateEventOpen(true)} className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
              Create Event
            </Button>
          )}
        </div>

        <div className="mb-6">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-600">
            Error loading events. Please try again later.
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-gray-600">
            No events found for the selected criteria.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onCancelRSVP={handleCancelRSVP}
                onUpdate={refetch}
              />
            ))}
          </div>
        )}

        {isAdmin && (
          <CreateEventDialog
            open={isCreateEventOpen}
            onOpenChange={setIsCreateEventOpen}
            onSuccess={handleEventCreated}
          />
        )}
      </div>
    </div>
  );
}