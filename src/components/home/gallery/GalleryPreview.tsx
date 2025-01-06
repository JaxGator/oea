import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GallerySection } from './GallerySection';
import { GalleryModal } from './GalleryModal';
import { GalleryCarousel } from './GalleryCarousel';
import { GalleryGrid } from './GalleryGrid';
import { GalleryHeader } from './GalleryHeader';
import { GalleryContainer } from './GalleryContainer';

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="mt-16 space-y-4">
      <GalleryContainer>
        {({ images, isLoading, error, isCarouselEnabled }) => (
          <>
            <GalleryHeader onViewAllClick={() => setShowFullGallery(true)} />
            
            {error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load gallery. Please try again later.
              </div>
            ) : isCarouselEnabled ? (
              <GalleryCarousel 
                images={images}
                onImageSelect={setSelectedImage}
                onKeyPress={handleKeyPress}
              />
            ) : (
              <GalleryGrid 
                images={images}
                onImageSelect={setSelectedImage}
                onKeyPress={handleKeyPress}
              />
            )}

            <Dialog 
              open={showFullGallery} 
              onOpenChange={(open) => {
                setShowFullGallery(open);
                if (!open) setSelectedImage(null);
              }}
            >
              <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <GallerySection
                  images={images}
                  isLoading={isLoading}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  onImageDeselect={() => setSelectedImage(null)}
                />
              </DialogContent>
            </Dialog>

            <GalleryModal 
              selectedImage={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          </>
        )}
      </GalleryContainer>
    </div>
  );
};