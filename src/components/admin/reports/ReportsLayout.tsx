import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download } from "lucide-react";
import { addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EventParticipationReport } from "./EventParticipationReport";
import { SystemUsageReport } from "./SystemUsageReport";
import { UserActivityReport } from "./UserActivityReport";
import { supabase } from "@/integrations/supabase/client";

interface EventData {
  id: string;
  title: string;
  date: string;
  event_rsvps: {
    id: string;
    response: string;
    user_id: string;
    created_at: string;
  }[];
  created_at: string;
}

interface EventParticipationReportProps {
  data: EventData[];
  isLoading: boolean;
  dateRange: DateRange | undefined;
}

interface SystemUsageReportProps {
  dateRange: DateRange | undefined;
}

interface UserActivityReportProps {
  dateRange: DateRange | undefined;
}

export function ReportsLayout() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', date],
    queryFn: async () => {
      if (!date?.from || !date?.to) return null;

      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          created_at,
          event_rsvps (
            id,
            response,
            user_id,
            created_at
          )
        `)
        .gte('date', date.from.toISOString())
        .lte('date', date.to.toISOString());

      if (error) throw error;
      return data as EventData[];
    },
  });

  const handleExport = async () => {
    if (!reportData) return;

    const csvContent = [
      ["Event ID", "Title", "Date", "RSVPs", "Created At"],
      ...reportData.map(event => [
        event.id,
        event.title,
        event.date,
        event.event_rsvps?.length || 0,
        event.created_at
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <DatePickerWithRange
          value={date}
          onChange={setDate}
        />
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="participation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participation">Event Participation</TabsTrigger>
          <TabsTrigger value="system">System Usage</TabsTrigger>
          <TabsTrigger value="user">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="participation" className="space-y-4">
          <EventParticipationReport 
            data={reportData || []} 
            isLoading={isLoading}
            dateRange={date}
          />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemUsageReport 
            dateRange={date}
          />
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <UserActivityReport 
            dateRange={date}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}