
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useRSVP } from "@/hooks/useRSVP";
import { CalendarDays } from "lucide-react";

export function FeaturedEvents() {
  const { handleRSVP, cancelRSVP } = useRSVP();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      console.log('Fetching featured events');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .eq('is_published', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching featured events:', error);
        throw error;
      }

      console.log('Featured events:', data);
      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="h-6 w-6 text-black" />
        <h2 className="text-xl sm:text-2xl font-bold">Featured Events</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRSVP={handleRSVP}
            onCancelRSVP={cancelRSVP}
          />
        ))}
      </div>
    </div>
  );
}
