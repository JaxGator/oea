import { Link } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedEvents() {
  const { data: events = [], isLoading } = useFeaturedEvents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events">
            <Button variant="ghost" className="text-primary hover:text-primary/90">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}