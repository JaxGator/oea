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
    if (!eventStats?.events) return;
    
    // Convert data to CSV format
    const headers = ['Event Name', 'Date', 'Attendees'];
    const csvData = eventStats.events.map(event => [
      event.name,
      event.date,
      event.attending
    ]);
    
    // Add headers to beginning of data
    csvData.unshift(headers);
    
    // Convert to CSV string
    const csvString = csvData
      .map(row => row
        .map(cell => {
          // Handle cells that contain commas by wrapping in quotes
          if (cell && cell.toString().includes(',')) {
            return `"${cell}"`;
          }
          return cell;
        })
        .join(',')
      )
      .join('\n');
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event-participation-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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