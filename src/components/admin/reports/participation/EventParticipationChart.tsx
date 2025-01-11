import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { EventStats } from "./types";

interface EventParticipationChartProps {
  data: EventStats[];
}

export function EventParticipationChart({ data }: EventParticipationChartProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Event Participation Overview</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attending" fill="#4CAF50" name="Attending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}