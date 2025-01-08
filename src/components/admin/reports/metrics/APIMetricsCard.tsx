import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface APIMetricsCardProps {
  apiRequests: Array<{
    date: string;
    requests: number;
    errors: number;
  }>;
}

export function APIMetricsCard({ apiRequests }: APIMetricsCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">API Requests Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={apiRequests}>
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
  );
}