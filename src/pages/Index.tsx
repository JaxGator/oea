import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  const navigate = useNavigate();
  
  console.log('Index page rendering...'); // Debug log

  return (
    <div className="min-h-screen bg-background">
      <FeaturedEvents />
      <div className="border-t border-gray-200">
        <PhotoGallery />
      </div>
    </div>
  );
}