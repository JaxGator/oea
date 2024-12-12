import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { DateFilter } from "@/components/DateFilter";
import { PlusIcon } from "lucide-react";
import { Event } from "@/types/event";
import { useToast } from "@/components/ui/use-toast";

// Mock data for initial development
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Meetup 2024",
    description: "Join us for an evening of networking and tech talks about the latest in web development.",
    date: "2024-04-20",
    location: "San Francisco, CA",
    attendees: 45,
    maxAttendees: 100,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Startup Networking Breakfast",
    description: "Start your day with great conversations and connections over breakfast.",
    date: "2024-04-21",
    location: "New York, NY",
    attendees: 25,
    maxAttendees: 50,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-432f7b1728f2?auto=format&fit=crop&q=80",
  },
];

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleRSVP = (eventId: string) => {
    toast({
      title: "RSVP Successful!",
      description: "You have successfully RSVP'd to this event.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <Button className="bg-primary hover:bg-primary-600">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <DateFilter selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
        ))}
      </div>
    </div>
  );
};

export default Index;