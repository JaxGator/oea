import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddToCalendarProps {
  event: {
    title: string;
    description: string | null;
    date: string;
    time: string;
    location: string;
  };
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  const formatDateTime = () => {
    const [hours, minutes] = event.time.split(':');
    const eventDate = new Date(event.date);
    eventDate.setHours(parseInt(hours), parseInt(minutes));
    return eventDate;
  };

  const startTime = formatDateTime();
  const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hour duration

  const googleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${endTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}`,
      details: event.description || '',
      location: event.location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const outlookCalendarUrl = () => {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: startTime.toISOString(),
      enddt: endTime.toISOString(),
      location: event.location,
      body: event.description || '',
    });
    return `https://outlook.live.com/calendar/0/${params.toString()}`;
  };

  const iCalendarUrl = () => {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  const downloadICalendar = () => {
    const link = document.createElement('a');
    link.href = iCalendarUrl();
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a
            href={googleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={outlookCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            Outlook Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={downloadICalendar}>
          Download iCalendar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}