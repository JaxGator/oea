import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { useEvents } from "@/hooks/useEvents";

export default function Index() {
  const { data: events = [], isLoading } = useEvents();
  
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FeaturedEvents />
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}