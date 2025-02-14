
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { GallerySection } from "@/components/home/GallerySection";
import { LeaderboardSection } from "@/components/home/LeaderboardSection";
import { SocialFeed } from "@/components/home/SocialFeed";

export default function Home() {
  return (
    <HomeLayout>
      <FeaturedEvents />
      <FeaturedMerch />
      <GallerySection />
      <LeaderboardSection />
      <SocialFeed />
    </HomeLayout>
  );
}
