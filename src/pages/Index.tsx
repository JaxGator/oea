import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { HomeLayout, HomeSection } from '@/components/home/HomeLayout';

const ErrorFallback = () => (
  <div className="p-4 text-center">
    <p className="text-red-500">Something went wrong loading this section.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-2 text-sm text-blue-500 hover:underline"
    >
      Try refreshing the page
    </button>
  </div>
);

export default function Index() {
  return (
    <HomeLayout>
      <HomeSection title="Events">
        <FeaturedEvents />
      </HomeSection>

      <HomeSection title="Gallery">
        <GalleryPreview />
      </HomeSection>

      <HomeSection title="Social Feed">
        <SocialFeed />
      </HomeSection>

      <HomeSection title="Merchandise">
        <FeaturedMerch />
      </HomeSection>
    </HomeLayout>
  );
}