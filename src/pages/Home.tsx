
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
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            <section className="space-y-8">
              <FeaturedEvents />
            </section>

            <section className="space-y-8">
              <LeaderboardSection />
            </section>

            <section className="space-y-8">
              <GalleryPreview />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TacoTracker />
              <SocialFeed />
            </section>
          </div>
        </div>
      </HomeLayout>
    </NotificationProvider>
  );
}
