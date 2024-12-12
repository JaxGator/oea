import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { DateFilter } from "@/components/DateFilter";
import { useToast } from "@/components/ui/use-toast";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", selectedDate],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(`
          *,
          event_rsvps(count)
        `)
        .order("date", { ascending: true });

      if (selectedDate) {
        query = query.eq("date", selectedDate.toISOString().split("T")[0]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        date: event.date,
        location: event.location,
        attendees: event.event_rsvps?.[0]?.count || 0,
        maxAttendees: event.max_guests,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      }));
    },
  });

  const handleRSVP = async (eventId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to RSVP",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("event_rsvps").insert({
        event_id: eventId,
        user_id: user.id,
        response: "going",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have successfully RSVP'd to this event",
      });
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      toast({
        title: "Error",
        description: "Failed to RSVP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <CreateEventDialog />
      </div>

      <DateFilter selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {isLoading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events found for the selected date.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
