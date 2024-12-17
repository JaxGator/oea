import { useNavigate } from "react-router-dom";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { PhotoGallery } from "@/components/home/PhotoGallery";

export default function Index() {
  const navigate = useNavigate();
  
  console.log('Index page rendering...'); // Debug log

  return (
    <main className="min-h-screen bg-background">
      <FeaturedEvents />
      <section className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <PhotoGallery />
        </div>
      </section>
    </main>
  );
}