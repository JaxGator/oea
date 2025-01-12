import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <DatePickerWithRange
          value={date}
          onChange={setDate}
        />
      </div>

      <Tabs defaultValue="participation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participation">Event Participation</TabsTrigger>
          <TabsTrigger value="system">System Usage</TabsTrigger>
          <TabsTrigger value="user">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="participation" className="space-y-4">
          <EventParticipationReport />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemUsageReport />
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <UserActivityReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}