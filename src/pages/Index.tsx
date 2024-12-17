import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  const navigate = useNavigate();
  
  console.log('Index page rendering...'); // Add debug log

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="bg-white">
        <FeaturedEvents />
        <div>
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}