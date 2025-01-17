interface AttendeeListProps {
  attendeeNames: string[];
  waitlistNames?: string[];
}

export function AttendeeList({ attendeeNames, waitlistNames = [] }: AttendeeListProps) {
  // Remove the initial return null check since we want to show "No attendees yet" message
  const validAttendees = attendeeNames.filter(name => name !== 'Unknown' && name !== '');
  
  // Group attendees by primary RSVP holder and preserve order
  const groupedAttendees = validAttendees.reduce((acc: Record<string, { guests: string[], order: number }>, name: string, index: number) => {
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

  return (
    <div className="text-sm text-gray-600 space-y-4" role="region" aria-label="Event attendees">
      {sortedHosts.length === 0 ? (
        <p className="text-gray-500 italic">No attendees yet</p>
      ) : (
        <div>
          <ul className="list-disc pl-5 space-y-2">
            {sortedHosts.map(({ host, guests }, index) => (
              <li key={index} className="space-y-1">
                <span className="font-medium">
                  {host}
                  {guests.length > 0 && (
                    <span className="text-gray-500 font-normal"> + {guests.length} guest{guests.length !== 1 ? 's' : ''}</span>
                  )}
                </span>
                {guests.length > 0 && (
                  <ul className="list-[circle] pl-5 mt-1 space-y-1">
                    {guests.map((guest, guestIndex) => (
                      <li key={guestIndex} className="text-gray-500">
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
          <h3 className="font-medium mb-2">Waitlist:</h3>
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