
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { FeaturedMerch } from "@/components/home/FeaturedMerch";
import { GallerySection } from "@/components/home/GallerySection";
import { LeaderboardSection } from "@/components/home/LeaderboardSection";
import { SocialFeed } from "@/components/home/SocialFeed";
import { useState } from "react";
import { useGalleryImages } from "@/hooks/gallery/useGalleryImages";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { images, isLoading } = useGalleryImages();

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleImageDeselect = () => {
    setSelectedImage(null);
  };

  return (
    <HomeLayout>
      <FeaturedEvents />
      <FeaturedMerch />
      <GallerySection 
        images={images.map(img => img.url)}
        isLoading={isLoading}
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        onImageDeselect={handleImageDeselect}
      />
      <LeaderboardSection />
      <SocialFeed />
    </HomeLayout>
  );
}
