import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download } from "lucide-react";
import { addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function ReportsLayout() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Fetch event participation data
  const { data: eventData, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['event-participation', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          created_at,
          events (
            title,
            date
          )
        `)
        .gte('created_at', date?.from?.toISOString() || '')
        .lte('created_at', date?.to?.toISOString() || '');

      if (error) throw error;
      
      // Process data for chart
      const processedData = data.reduce((acc: any[], rsvp: any) => {
        const date = new Date(rsvp.created_at).toLocaleDateString();
        const existingDate = acc.find(item => item.date === date);
        
        if (existingDate) {
          existingDate.rsvps += 1;
        } else {
          acc.push({ date, rsvps: 1 });
        }
        
        return acc;
      }, []);

      return processedData;
    },
    enabled: !!date?.from && !!date?.to,
  });

  // Fetch user activity data
  const { data: userData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['user-activity', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', date?.from?.toISOString() || '')
        .lte('created_at', date?.to?.toISOString() || '');

      if (error) throw error;

      // Process data for chart
      const processedData = data.reduce((acc: any[], user: any) => {
        const date = new Date(user.created_at).toLocaleDateString();
        const existingDate = acc.find(item => item.date === date);
        
        if (existingDate) {
          existingDate.signups += 1;
        } else {
          acc.push({ date, signups: 1 });
        }
        
        return acc;
      }, []);

      return processedData;
    },
    enabled: !!date?.from && !!date?.to,
  });

  const handleExport = async () => {
    const csvData = eventData?.map(item => ({
      Date: item.date,
      RSVPs: item.rsvps,
    }));

    const csvString = [
      ['Date', 'RSVPs'],
      ...csvData.map(item => [item.Date, item.RSVPs])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-participation-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <DateRangePicker date={date} onDateChange={setDate} />
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={!eventData?.length}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Event Participation</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Participation Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eventData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="rsvps" 
                      stroke="#8884d8" 
                      name="RSVPs"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Signups Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="signups" 
                      stroke="#82ca9d" 
                      name="Signups"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}