import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturedEvents />
    </div>
  );
}