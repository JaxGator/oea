
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { LeaderboardSection } from "@/components/home/LeaderboardSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { SocialFeed } from "@/components/home/SocialFeed";
import { TacoTracker } from "@/components/home/TacoTracker";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

export default function Home() {
  return (
    <NotificationProvider>
      <HomeLayout>
        <div className="space-y-8">
          <FeaturedEvents />
        </div>

        <div className="space-y-8">
          <LeaderboardSection />
        </div>

        <div className="space-y-8">
          <GalleryPreview />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TacoTracker />
          <SocialFeed />
        </div>
      </HomeLayout>
    </NotificationProvider>
  );
}
