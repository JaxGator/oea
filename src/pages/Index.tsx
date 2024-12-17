import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  const navigate = useNavigate();
  
  console.log('Index page rendering...'); // Debug log

  return (
    <div className="min-h-screen bg-background">
      <FeaturedEvents />
      <div className="container mx-auto px-4 py-8">
        <PhotoGallery />
      </div>
    </div>
  );
}