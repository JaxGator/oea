import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GallerySection } from './GallerySection';
import { GalleryCarousel } from './gallery/GalleryCarousel';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryHeader } from './gallery/GalleryHeader';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      try {
        console.log('Fetching gallery images...');
        const { data: storageData, error: storageError } = await supabase.storage
          .from('gallery')
          .list('', {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (storageError) {
          console.error('Storage error:', storageError);
          toast.error('Failed to load gallery images');
          return [];
        }

        if (!storageData || storageData.length === 0) {
          console.log('No images found in gallery');
          return [];
        }

        const imageFiles = storageData.filter(file => 
          file.name.match(/\.(jpg|jpeg|png|gif)$/i)
        );

        console.log('Found image files:', imageFiles.length);

        return imageFiles.map(file => {
          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(file.name);
          return data.publicUrl;
        });
      } catch (error) {
        console.error('Error in gallery images query:', error);
        toast.error('Failed to load gallery images');
        return [];
      }
    },
    retry: 1
  });

  const { data: carouselEnabled = false } = useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      try {
        console.log('Fetching carousel config...');
        const { data, error: configError } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'gallery_carousel_enabled')
          .maybeSingle();
        
        if (configError) {
          console.error('Config error:', configError);
          return false;
        }
        
        return data?.value === 'true';
      } catch (error) {
        console.error('Error in carousel config query:', error);
        return false;
      }
    },
    retry: 1
  });

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (error) {
    console.error('Gallery error:', error);
    return (
      <div className="mt-16 text-center text-red-500">
        Unable to load gallery. Please try again later.
      </div>
    );
  }

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <div className="mt-16 space-y-4">
      <GalleryHeader onViewAllClick={() => setShowFullGallery(true)} />
      
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">
          <LoaderCircle className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading gallery...
        </div>
      ) : !hasImages ? (
        <div className="text-center py-8 text-gray-500">
          No images available in the gallery.
        </div>
      ) : carouselEnabled ? (
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

      {/* Full Gallery Dialog */}
      {showFullGallery && (
        <Dialog 
          open={showFullGallery} 
          onOpenChange={setShowFullGallery}
        >
          <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <GallerySection
              images={images}
              isLoading={isLoading}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onImageDeselect={handleCloseModal}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog 
          open={!!selectedImage} 
          onOpenChange={(open) => !open && handleCloseModal()}
        >
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
            <div className="relative w-full h-full flex items-center justify-center bg-background">
              <img
                src={selectedImage}
                alt="Selected gallery image"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};