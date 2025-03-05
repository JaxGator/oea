
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { HomeLayout } from '@/components/home/HomeLayout';
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { TacoTracker } from "@/components/home/TacoTracker";
import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const LoadingSection = () => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

export default function Index() {
  const queryClient = useQueryClient();
  
  // Prefetch data for components that will be rendered
  useEffect(() => {
    // Prefetch queries that might be needed
    queryClient.prefetchQuery({
      queryKey: ['featured-events'],
      queryFn: () => fetch('/api/events/featured').then(res => res.json()),
      staleTime: 1000 * 60 * 5 // 5 minutes
    });
    
    // Prefetch other important queries
    queryClient.prefetchQuery({
      queryKey: ['gallery-preview'],
      queryFn: () => fetch('/api/gallery/preview').then(res => res.json()),
      staleTime: 1000 * 60 * 15 // 15 minutes
    });
  }, [queryClient]);

  return (
    <NotificationProvider>
      <HomeLayout>
        <Suspense fallback={<LoadingSection />}>
          <div className="space-y-8">
            <FeaturedEvents />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <div className="space-y-8">
            <LeaderboardSection />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <div className="space-y-8">
            <GalleryPreview />
          </div>
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
