import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { HomeLayout, HomeSection } from '@/components/home/HomeLayout';
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { NotificationProvider } from "@/components/providers/NotificationProvider";

export default function Index() {
  return (
    <NotificationProvider>
      <HomeLayout>
        <HomeSection title="Events">
          <FeaturedEvents />
        </HomeSection>

        <HomeSection title="Leaderboard">
          <LeaderboardSection />
        </HomeSection>

        <HomeSection title="Gallery">
          <GalleryPreview />
        </HomeSection>

        <HomeSection title="Social Feed">
          <SocialFeed />
        </HomeSection>
      </HomeLayout>
    </NotificationProvider>
  );
}