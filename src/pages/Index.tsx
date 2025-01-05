import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";

export default function Index() {
  return (
    <main className="bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section aria-labelledby="featured-events-heading">
            <h2 id="featured-events-heading" className="text-2xl font-bold mb-6">Featured Events</h2>
            <FeaturedEvents />
          </section>

          <section aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="text-2xl font-bold mb-6">Photo Gallery</h2>
            <GalleryPreview />
          </section>

          <section aria-labelledby="merch-heading">
            <h2 id="merch-heading" className="text-2xl font-bold mb-6">Featured Merchandise</h2>
            <FeaturedMerch />
          </section>
        </div>
      </div>
    </main>
  );
}