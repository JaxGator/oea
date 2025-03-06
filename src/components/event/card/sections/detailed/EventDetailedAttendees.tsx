
import { Separator } from "@/components/ui/separator";

interface EventDetailedAttendeesProps {
  attendeeNames: string[];
  waitlistNames: string[];
  canViewRSVPs?: boolean;
}

export function EventDetailedAttendees({
  attendeeNames,
  waitlistNames
}: EventDetailedAttendeesProps) {
  // If there are no attendees, don't show this section
  if (attendeeNames.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-2">Attendees</h3>
        <ul className="list-disc pl-5 space-y-1">
          {attendeeNames.map((name, index) => (
            <li key={index} className="text-gray-700">{name}</li>
          ))}
        </ul>
      </div>
      
      {waitlistNames.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Waitlist</h3>
          <ul className="list-disc pl-5 space-y-1">
            {waitlistNames.map((name, index) => (
              <li key={index} className="text-gray-700">{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
