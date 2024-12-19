import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  console.log('Index page rendering...');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FeaturedEvents />
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}