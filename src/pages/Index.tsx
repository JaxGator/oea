
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
  <div className="flex justify-center items-center py-8 my-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Loading content...</span>
  </div>
);

const ErrorSection = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center py-8 my-4">
    <div className="p-4 rounded-lg bg-red-50 text-red-800 max-w-md">
      <p>{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  </div>
);

export default function Index() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    console.log('Index page mounted');
    return () => console.log('Index page unmounted');
  }, []);

  return (
    <NotificationProvider>
      <HomeLayout>
        <ErrorBoundary fallback={<ErrorSection message="Failed to load events section" />}>
          <Suspense fallback={<LoadingSection />}>
            <div className="space-y-8">
              <FeaturedEvents />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorSection message="Failed to load leaderboard section" />}>
          <Suspense fallback={<LoadingSection />}>
            <div className="space-y-8">
              <LeaderboardSection />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorSection message="Failed to load gallery section" />}>
          <Suspense fallback={<LoadingSection />}>
            <div className="space-y-8">
              <GalleryPreview />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorSection message="Failed to load social features" />}>
          <Suspense fallback={<LoadingSection />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TacoTracker />
              <SocialFeed />
            </div>
          </Suspense>
        </ErrorBoundary>
      </HomeLayout>
    </NotificationProvider>
  );
}
