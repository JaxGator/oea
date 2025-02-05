
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { EventParticipationFilters } from "./participation/EventParticipationFilters";
import { EventParticipationChart } from "./participation/EventParticipationChart";
import { EventParticipationTable } from "./participation/EventParticipationTable";
import type { EventStats } from "./participation/types";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventParticipationReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [eventType, setEventType] = useState<string>("all");

  const { data: eventStats, isLoading } = useQuery({
    queryKey: ['event-stats', dateRange, eventType],
    queryFn: async () => {
      try {
        let query = supabase
          .from('events')
          .select(`
            *,
            event_rsvps (
              response
            )
          `)
          .order('date', { ascending: false });

        if (dateRange?.from) {
          query = query.gte('date', format(dateRange.from, 'yyyy-MM-dd'));
        }
        if (dateRange?.to) {
          query = query.lte('date', format(dateRange.to, 'yyyy-MM-dd'));
        }

        const { data: events, error } = await query;

        if (error) {
          console.error('Error fetching events:', error);
          toast.error("Failed to fetch event data");
          throw error;
        }

        if (!events) {
          return {
            events: [],
            topEvents: []
          };
        }

        const processedEvents = events.map((event: any) => ({
          name: event.title,
          attending: event.event_rsvps?.filter((rsvp: any) => rsvp.response === 'attending').length || 0,
          date: format(new Date(event.date), 'MMM dd, yyyy')
        }));

        return {
          events: processedEvents,
          topEvents: processedEvents
            .sort((a: EventStats, b: EventStats) => b.attending - a.attending)
            .slice(0, 5)
        };
      } catch (error) {
        console.error('Error in event stats query:', error);
        toast.error("Failed to load event statistics");
        throw error;
      }
    }
  });

  const handleExport = () => {
    if (!eventStats?.events) return;
    
    const headers = ['Event Name', 'Date', 'Attendees'];
    const csvData = eventStats.events.map(event => [
      event.name,
      event.date,
      event.attending
    ]);
    
    csvData.unshift(headers);
    
    const csvString = csvData
      .map(row => row
        .map(cell => {
          if (cell && cell.toString().includes(',')) {
            return `"${cell}"`;
          }
          return cell;
        })
        .join(',')
      )
      .join('\n');
    
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
    return (
      <div className="space-y-6">
        <Card className="p-4">
          <Skeleton className="h-[40px] w-full mb-4" />
          <Skeleton className="h-[40px] w-3/4" />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-[250px] w-full" />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-[200px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <EventParticipationFilters
          dateRange={dateRange}
          eventType={eventType}
          onDateRangeChange={setDateRange}
          onEventTypeChange={setEventType}
          onExport={handleExport}
        />
      </Card>
      
      {eventStats && (
        <>
          <EventParticipationChart data={eventStats.events} />
          <EventParticipationTable data={eventStats.topEvents} />
        </>
      )}
    </div>
  );
}
