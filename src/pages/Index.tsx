
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { HomeLayout, HomeSection } from '@/components/home/HomeLayout';
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { TacoTracker } from "@/components/home/TacoTracker";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSection = () => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

export default function Index() {
  return (
    <NotificationProvider>
      <HomeLayout>
        <Suspense fallback={<LoadingSection />}>
          <HomeSection title="Featured Events">
            <FeaturedEvents />
          </HomeSection>
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <HomeSection title="Leaderboard">
            <LeaderboardSection />
          </HomeSection>
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <HomeSection title="Gallery">
            <GalleryPreview />
          </HomeSection>
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TacoTracker />
            <SocialFeed />
          </div>
        </Suspense>
      </HomeLayout>
    </NotificationProvider>
  );
}
