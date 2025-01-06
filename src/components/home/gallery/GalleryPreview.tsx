import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GallerySection } from '../GallerySection';
import { GalleryModal } from './GalleryModal';
import { GalleryCarousel } from './GalleryCarousel';
import { GalleryGrid } from './GalleryGrid';
import { GalleryHeader } from './GalleryHeader';
import { GalleryContainer } from './GalleryContainer';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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
            <GalleryHeader 
              onViewAllClick={() => setShowFullGallery(true)} 
              totalImages={images.length}
            />
            
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load gallery images. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No images available in the gallery yet.
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