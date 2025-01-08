import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4CAF50', '#f44336'];

interface SuccessRateCardProps {
  successRate: {
    success: number;
    failure: number;
  };
}

export function SuccessRateCard({ successRate }: SuccessRateCardProps) {
  const data = [
    { name: 'Success', value: successRate.success },
    { name: 'Failure', value: successRate.failure },
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">API Success Rate</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}