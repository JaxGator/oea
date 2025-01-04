import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";

export default function Index() {
  return (
    <div className="bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FeaturedEvents />
          <GalleryPreview />
          <FeaturedMerch />
        </div>
      </div>
    </div>
  );
}