
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { supabase } from '@/integrations/supabase/client';
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
  
  // Prefetch featured events using the same query key as useFeaturedEvents
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['featuredEvents'],
      queryFn: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('is_published', true)
          .gte('date', today)
          .order('date', { ascending: true });
        return data || [];
      },
      staleTime: 1000 * 60 * 5,
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
