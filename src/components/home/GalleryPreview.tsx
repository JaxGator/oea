import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GallerySection } from './GallerySection';
import { GalleryCarousel } from './gallery/GalleryCarousel';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryHeader } from './gallery/GalleryHeader';
import { GalleryContainer } from './gallery/GalleryContainer';
import { GalleryModalContent } from './gallery/GalleryModalContent';
import { useGalleryState } from './gallery/useGalleryState';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';

export const GalleryPreview = () => {
  const { profile } = useAuthState();
  const isAdmin = profile?.is_admin;

  const { data: carouselEnabled } = useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'gallery_carousel_enabled')
        .single();
      
      if (error) throw error;
      return data?.value === 'true';
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className="mt-16 space-y-4">
      <GalleryContainer>
        {({ images, isLoading, error }) => {
          const {
            showFullGallery,
            setShowFullGallery,
            selectedImage,
            setSelectedImage,
            handlePrevious,
            handleNext,
            isFirstImage,
            isLastImage,
            handleKeyPress,
          } = useGalleryState(images);

          const handleNavigate = (direction: 'next' | 'prev') => {
            if (direction === 'next') {
              handleNext();
            } else {
              handlePrevious();
            }
          };

          return (
            <>
              <GalleryHeader 
                onViewAllClick={() => setShowFullGallery(true)} 
                totalImages={images.length}
                isAdmin={isAdmin}
              />
              
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to load gallery images. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : carouselEnabled ? (
                <GalleryCarousel 
                  images={images}
                  onImageSelect={setSelectedImage}
                  onKeyPress={handleKeyPress}
                  isLoading={isLoading}
                  isAdmin={isAdmin}
                />
              ) : (
                <GalleryGrid 
                  images={images}
                  onImageSelect={setSelectedImage}
                  onKeyPress={handleKeyPress}
                  isLoading={isLoading}
                  isAdmin={isAdmin}
                />
              )}

              {/* Full Gallery Dialog */}
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
                    isAdmin={isAdmin}
                  />
                </DialogContent>
              </Dialog>

              {/* Image Preview Dialog */}
              {selectedImage && (
                <Dialog 
                  open={!!selectedImage} 
                  onOpenChange={(open) => !open && setSelectedImage(null)}
                >
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-transparent border-none">
                    <GalleryModalContent
                      selectedImage={selectedImage}
                      onClose={() => setSelectedImage(null)}
                      onNavigate={handleNavigate}
                      isFirstImage={isFirstImage}
                      isLastImage={isLastImage}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </>
          );
        }}
      </GalleryContainer>
    </div>
  );
};