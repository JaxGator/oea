import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#4CAF50', '#f44336'];

// Define actual pages in the application
const APP_PAGES = [
  { route: '/', name: 'Home' },
  { route: '/events', name: 'Events' },
  { route: '/about', name: 'About' },
  { route: '/members', name: 'Members' },
  { route: '/profile', name: 'Profile' },
  { route: '/admin', name: 'Admin Dashboard' },
  { route: '/resources', name: 'Resources' },
  { route: '/store', name: 'Store' }
];

export function SystemUsageReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Query for system stats
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats', dateRange],
    queryFn: async () => {
      // This would be replaced with actual API metrics data
      return {
        apiRequests: Array.from({ length: 7 }, (_, i) => ({
          date: `Day ${i + 1}`,
          requests: Math.floor(Math.random() * 1000),
          errors: Math.floor(Math.random() * 100),
        })),
        successRate: {
          success: 95,
          failure: 5,
        },
        loadTimes: APP_PAGES.map(page => ({
          page: page.name,
          loadTime: Math.random() * 2, // Simulated load times between 0-2 seconds
        })),
      };
    },
  });

  // Query for service health status
  const { data: serviceHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['service-health'],
    queryFn: async () => {
      // Check Supabase connection
      const supabaseHealth = await testSupabaseConnection();
      
      // Check Netlify status (this would typically be an API call to Netlify's status endpoint)
      const netlifyHealth = await fetch('https://www.netlifystatus.com/api/v2/status.json')
        .then(res => res.ok)
        .catch(() => false);

      return {
        supabase: {
          status: supabaseHealth ? 'healthy' : 'error',
          latency: Math.random() * 100, // This would be real latency in ms
        },
        netlify: {
          status: netlifyHealth ? 'healthy' : 'error',
          latency: Math.random() * 50, // This would be real latency in ms
        }
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleExport = () => {
    // Implementation for CSV export
    console.log("Exporting system data...");
  };

  if (statsLoading || healthLoading) {
    return <div>Loading...</div>;
  }

  const successData = [
    { name: 'Success', value: systemStats?.successRate.success },
    { name: 'Failure', value: systemStats?.successRate.failure },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <DatePickerWithRange
          value={dateRange}
          onChange={(newDateRange: DateRange | undefined) => setDateRange(newDateRange)}
        />
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Service Health Status */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Service Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="font-medium">Supabase</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                serviceHealth?.supabase.status === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {serviceHealth?.supabase.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Latency: {serviceHealth?.supabase.latency.toFixed(2)}ms
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="font-medium">Netlify</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                serviceHealth?.netlify.status === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {serviceHealth?.netlify.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Latency: {serviceHealth?.netlify.latency.toFixed(2)}ms
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">API Requests Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemStats?.apiRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" />
                <Line type="monotone" dataKey="errors" stroke="#ff0000" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">API Success Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Page Load Times</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Page</th>
                <th className="text-left p-2">Load Time (seconds)</th>
              </tr>
            </thead>
            <tbody>
              {systemStats?.loadTimes.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.page}</td>
                  <td className="p-2">{item.loadTime.toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}