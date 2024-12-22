import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { EventsMap } from "@/components/event/EventsMap";
import { useEvents } from "@/hooks/useEvents";

export default function Index() {
  const { data: events = [], isLoading } = useEvents();
  
  // Filter out past events for the map
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            {!isLoading && upcomingEvents.length > 0 && (
              <EventsMap events={upcomingEvents} />
            )}
          </div>
          <FeaturedEvents />
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}