import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { EventsMap } from "@/components/event/EventsMap";
import { useEvents } from "@/hooks/useEvents";

export default function Index() {
  const { data: events } = useEvents();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <EventsMap events={events || []} />
          <FeaturedEvents />
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}