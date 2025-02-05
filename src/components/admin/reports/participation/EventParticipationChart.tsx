
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { EventStats } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventParticipationChartProps {
  data: EventStats[];
}

export function EventParticipationChart({ data }: EventParticipationChartProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Event Participation Overview</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={60}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="attending" 
              fill="#4CAF50" 
              name="Attending"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
