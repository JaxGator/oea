import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="bg-white">
        <FeaturedEvents />
        <PhotoGallery />
      </div>
    </div>
  );
}