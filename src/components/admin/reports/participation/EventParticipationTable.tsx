
import { Card } from "@/components/ui/card";
import { EventStats } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventParticipationTableProps {
  data: EventStats[];
}

export function EventParticipationTable({ data }: EventParticipationTableProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Top 5 Events by Participation</h3>
      <div className="space-y-4">
        {isMobile ? (
          // Mobile card view
          <div className="space-y-4">
            {data.map((event, index) => (
              <Card key={index} className="p-3 space-y-2">
                <div className="font-medium truncate">{event.name}</div>
                <div className="text-sm text-muted-foreground">{event.date}</div>
                <div className="text-sm font-medium">
                  Attending: {event.attending}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Desktop table view
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
        )}
      </div>
    </Card>
  );
}
