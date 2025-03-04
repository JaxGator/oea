
import { AttendeeList } from "@/components/event/details/AttendeeList";

interface EventDetailedAttendeesProps {
  attendeeNames: string[];
  waitlistNames: string[];
  canViewRSVPs: boolean;
}

export function EventDetailedAttendees({ 
  attendeeNames, 
  waitlistNames, 
  canViewRSVPs 
}: EventDetailedAttendeesProps) {
  if (!canViewRSVPs) return null;
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Event Attendees</h3>
      <AttendeeList
        attendeeNames={attendeeNames}
        waitlistNames={waitlistNames}
      />
    </div>
  );
}
