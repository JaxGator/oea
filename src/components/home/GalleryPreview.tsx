import { ImagePreviewDialog } from "./gallery/ImagePreviewDialog";
import { FullGalleryDialog } from "./gallery/FullGalleryDialog";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGalleryImageValidation } from "@/hooks/gallery/useGalleryImageValidation";
import { Loader2 } from "lucide-react";

export function GalleryPreview() {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { validatedUrls: images, isValidating } = useGalleryImageValidation();

  const handleImageSelect = (imageUrl: string) => {
    console.log('Selected image:', imageUrl);
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

  const isFirstImage = selectedImage === images[0];
  const isLastImage = selectedImage === images[images.length - 1];

  if (isValidating) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            No images available in the gallery.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
          <Button 
            onClick={() => setShowFullGallery(true)}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            View All
          </Button>
        </div>

        <GalleryGrid 
          images={images} 
          onImageSelect={handleImageSelect}
          isLoading={isValidating}
        />

        <FullGalleryDialog
          open={showFullGallery}
          onOpenChange={setShowFullGallery}
        />

        <ImagePreviewDialog
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