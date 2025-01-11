interface AttendeeListProps {
  attendeeNames: string[];
}

export function AttendeeList({ attendeeNames }: AttendeeListProps) {
  if (attendeeNames.length === 0) return null;

  return (
    <div className="text-sm text-gray-600">
      <p className="font-medium mb-2">Attendees:</p>
      <ul className="list-disc pl-5 space-y-1">
        {attendeeNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}