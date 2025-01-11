interface AttendeeListProps {
  attendeeNames: string[];
  waitlistNames?: string[];
}

export function AttendeeList({ attendeeNames, waitlistNames = [] }: AttendeeListProps) {
  // Group attendees by primary RSVP holder and preserve order
  const groupedAttendees = attendeeNames.reduce((acc: Record<string, { guests: string[], order: number }>, name: string, index: number) => {
    if (name.includes(" (Guest of ")) {
      const [guestName, hostInfo] = name.split(" (Guest of ");
      const hostName = hostInfo.replace(")", "");
      if (!acc[hostName]) {
        acc[hostName] = { guests: [], order: index };
      }
      acc[hostName].guests.push(guestName);
    } else {
      // It's a primary RSVP holder
      if (!acc[name]) {
        acc[name] = { guests: [], order: index };
      }
    }
    return acc;
  }, {});

  // Sort hosts by their original RSVP order
  const sortedHosts = Object.entries(groupedAttendees)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([host, data]) => ({ host, guests: data.guests }));

  if (sortedHosts.length === 0 && waitlistNames.length === 0) return null;

  return (
    <div className="text-sm text-gray-600 space-y-4">
      {sortedHosts.length > 0 && (
        <div>
          <p className="font-medium mb-2">Attendees:</p>
          <ul className="list-disc pl-5 space-y-2">
            {sortedHosts.map(({ host, guests }, index) => (
              <li key={index}>
                {host}
                {guests.length > 0 && (
                  <ul className="pl-5 mt-1 space-y-1">
                    {guests.map((guest, guestIndex) => (
                      <li key={guestIndex} className="list-[circle] marker:text-gray-400">
                        {guest}
                      </li>
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