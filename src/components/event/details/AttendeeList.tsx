interface AttendeeListProps {
  attendeeNames: string[];
  waitlistNames?: string[];
}

export function AttendeeList({ attendeeNames, waitlistNames = [] }: AttendeeListProps) {
  // Group attendees by primary RSVP holder
  const groupedAttendees = attendeeNames.reduce((acc: Record<string, string[]>, name: string) => {
    // If the name contains " (Guest of ", it's a guest
    if (name.includes(" (Guest of ")) {
      const [guestName, hostInfo] = name.split(" (Guest of ");
      const hostName = hostInfo.replace(")", "");
      if (!acc[hostName]) {
        acc[hostName] = [];
      }
      acc[hostName].push(guestName);
    } else {
      // It's a primary RSVP holder
      if (!acc[name]) {
        acc[name] = [];
      }
    }
    return acc;
  }, {});

  if (Object.keys(groupedAttendees).length === 0 && waitlistNames.length === 0) return null;

  return (
    <div className="text-sm text-gray-600 space-y-4">
      {Object.keys(groupedAttendees).length > 0 && (
        <div>
          <p className="font-medium mb-2">Attendees:</p>
          <ul className="list-disc pl-5 space-y-2">
            {Object.entries(groupedAttendees).map(([host, guests], index) => (
              <li key={index}>
                {host}
                {guests.length > 0 && (
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    {guests.map((guest, guestIndex) => (
                      <li key={guestIndex}>{guest}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {waitlistNames.length > 0 && (
        <div>
          <p className="font-medium mb-2">Waitlist:</p>
          <ul className="list-disc pl-5 space-y-1">
            {waitlistNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}