import { Card } from "@/components/ui/card";
import { EventStats } from "./types";

interface EventParticipationTableProps {
  data: EventStats[];
}

export function EventParticipationTable({ data }: EventParticipationTableProps) {
  return (
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
            {data.map((event, index) => (
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
  );
}