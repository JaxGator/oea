import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GallerySection } from './GallerySection';
import { GalleryModal } from './gallery/GalleryModal';
import { GalleryCarousel } from './gallery/GalleryCarousel';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryHeader } from './gallery/GalleryHeader';

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gallery')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (storageError) {
        console.error('Error fetching gallery images:', storageError);
        return [];
      }

      if (!storageData || !Array.isArray(storageData)) {
        return [];
      }

      const imageFiles = storageData.filter(file => 
        file.name.match(/\.(jpg|jpeg|png|gif)$/i)
      );

      return imageFiles.map(file => {
        const { data } = supabase.storage
          .from('gallery')
          .getPublicUrl(file.name);
        return data.publicUrl;
      });
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { data: carouselEnabled = false } = useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      const { data, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'gallery_carousel_enabled')
        .maybeSingle();
      
      if (configError) {
        console.error('Error fetching gallery config:', configError);
        return false;
      }
      
      return data?.value === 'true';
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  const handleCloseGallery = () => {
    setShowFullGallery(false);
    setSelectedImage(null);
  };

  if (error) {
    return (
      <div className="mt-16 text-center text-red-500">
        Unable to load gallery. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-16 text-center text-gray-600">
        Loading gallery...
      </div>
    );
  }

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <div className="mt-16 space-y-4">
      <GalleryHeader onViewAllClick={() => setShowFullGallery(true)} />
      
      {hasImages ? (
        carouselEnabled ? (
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
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No images available in the gallery.
        </div>
      )}

      {showFullGallery && (
        <Dialog 
          open={showFullGallery} 
          onOpenChange={handleCloseGallery}
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
      )}

      {selectedImage && (
        <GalleryModal 
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};