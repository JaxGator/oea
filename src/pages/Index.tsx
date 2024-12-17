import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  console.log('Index page rendering...');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FeaturedEvents />
        <div className="mt-12">
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}