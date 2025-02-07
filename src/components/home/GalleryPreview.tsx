
import { useState } from "react";
import { ImagePreviewDialog } from "./gallery/ImagePreviewDialog";
import { FullGalleryDialog } from "./gallery/FullGalleryDialog";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useGalleryPreview } from "@/hooks/gallery/useGalleryPreview";
import { GalleryPreviewModal } from "./gallery/GalleryPreviewModal";
import { useCarouselConfig } from "@/hooks/gallery/useCarouselConfig";
import { GalleryCarousel } from "./gallery/GalleryCarousel";

export function GalleryPreview() {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isError, isLoading } = useGalleryPreview(6);
  const { carouselEnabled } = useCarouselConfig();

  console.log('GalleryPreview render:', { images, isError, isLoading, carouselEnabled });

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
    const currentIndex = images.findIndex(img => img === selectedImage);
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;

    setSelectedImage(images[newIndex]);
  };

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  const isFirstImage = selectedImage === images[0];
  const isLastImage = selectedImage === images[images.length - 1];

  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Photo Gallery
          </h2>
          <Button 
            onClick={() => setShowFullGallery(true)}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            View All
          </Button>
        </div>

        {carouselEnabled ? (
          <GalleryCarousel 
            images={images}
            onImageSelect={handleImageSelect}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
          />
        ) : (
          <GalleryGrid 
            images={images} 
            onImageSelect={handleImageSelect}
            isPreview={true}
            isLoading={isLoading}
          />
        )}

        <FullGalleryDialog
          open={showFullGallery}
          onOpenChange={setShowFullGallery}
        />

        <GalleryPreviewModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNavigate={handleNavigate}
          isFirstImage={isFirstImage}
          isLastImage={isLastImage}
        />
      </div>
    </div>
  );
}
