import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { SocialFeedSection } from "@/components/home/SocialFeedSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <FeaturedEvents />
          <SocialFeedSection />
        </div>
      </div>
    </div>
  );
}