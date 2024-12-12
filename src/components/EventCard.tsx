import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Event } from "@/types/event";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string) => void;
}

export function EventCard({ event, onRSVP }: EventCardProps) {
  const isFullyBooked = event.attendees >= event.maxAttendees;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white">
      <CardHeader className="relative p-0">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm">
            {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <UsersIcon className="w-4 h-4" />
          <span className="text-sm">
            {event.attendees} / {event.maxAttendees} attendees
          </span>
        </div>
        <p className="text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onRSVP(event.id)}
          disabled={isFullyBooked}
          className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
        >
          {isFullyBooked ? "Fully Booked" : "RSVP Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}