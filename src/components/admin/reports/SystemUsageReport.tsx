import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const COLORS = ['#4CAF50', '#f44336'];

export function SystemUsageReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();

  const { data: systemStats, isLoading } = useQuery({
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
        loadTimes: Array.from({ length: 7 }, (_, i) => ({
          page: `Page ${i + 1}`,
          loadTime: Math.random() * 2,
        })),
      };
    },
  });

  const handleExport = () => {
    // Implementation for CSV export
    console.log("Exporting system data...");
  };

  if (isLoading) {
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
          onChange={setDateRange}
        />
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

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
              {systemStats?.loadTimes.map((item: any, index: number) => (
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