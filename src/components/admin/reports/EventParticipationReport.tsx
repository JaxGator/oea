import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { EventParticipationFilters } from "./participation/EventParticipationFilters";
import { EventParticipationChart } from "./participation/EventParticipationChart";
import { EventParticipationTable } from "./participation/EventParticipationTable";
import type { EventStats } from "./participation/types";

export function EventParticipationReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [eventType, setEventType] = useState<string>("all");

  const { data: eventStats, isLoading } = useQuery({
    queryKey: ['event-stats', dateRange, eventType],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps (
            response
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const processedEvents = events.map((event: any) => ({
        name: event.title,
        attending: event.event_rsvps.filter((rsvp: any) => rsvp.response === 'attending').length,
        date: format(new Date(event.date), 'MMM dd, yyyy')
      }));

      return {
        events: processedEvents,
        topEvents: processedEvents
          .sort((a: EventStats, b: EventStats) => b.attending - a.attending)
          .slice(0, 5)
      };
    }
  });

  const handleExport = () => {
    console.log("Exporting event data...");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <EventParticipationFilters
        dateRange={dateRange}
        eventType={eventType}
        onDateRangeChange={setDateRange}
        onEventTypeChange={setEventType}
        onExport={handleExport}
      />
      
      {eventStats && (
        <>
          <EventParticipationChart data={eventStats.events} />
          <EventParticipationTable data={eventStats.topEvents} />
        </>
      )}
    </div>
  );
}