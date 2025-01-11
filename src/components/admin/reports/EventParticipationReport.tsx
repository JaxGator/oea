import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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
          .sort((a: any, b: any) => b.attending - a.attending)
          .slice(0, 5)
      };
    }
  });

  const handleExport = () => {
    // Implementation for CSV export
    console.log("Exporting event data...");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <DatePickerWithRange
          value={dateRange}
          onChange={(newDateRange: DateRange | undefined) => setDateRange(newDateRange)}
        />
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Event Participation Overview</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventStats?.events}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attending" fill="#4CAF50" name="Attending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Top 5 Events by Participation</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Event Name</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Attending</th>
              </tr>
            </thead>
            <tbody>
              {eventStats?.topEvents.map((event: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{event.name}</td>
                  <td className="p-2">{event.date}</td>
                  <td className="p-2">{event.attending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}