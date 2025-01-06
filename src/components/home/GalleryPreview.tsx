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

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data: storageData, error } = await supabase.storage
        .from('gallery')
        .list();

      if (error) {
        console.error('Error fetching gallery images:', error);
        return [];
      }

      if (!storageData) {
        return [];
      }

      const imageUrls = storageData
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => {
          const { data } = supabase.storage.from('gallery').getPublicUrl(file.name);
          return data.publicUrl;
        });

      return imageUrls;
    },
    retry: false
  });

  const { data: config = false } = useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'gallery_carousel_enabled')
          .single();
        
        if (error) throw error;
        return data?.value === 'true';
      } catch (error) {
        console.error('Error fetching gallery config:', error);
        return false;
      }
    },
    retry: false
  });

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  if (isLoading) {
    return <div className="mt-16 space-y-4">Loading gallery...</div>;
  }

  return (
    <div className="mt-16 space-y-4">
      <GalleryHeader onViewAllClick={() => setShowFullGallery(true)} />
      
      {images.length > 0 ? (
        config ? (
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
        <Dialog open={showFullGallery} onOpenChange={setShowFullGallery}>
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

      <GalleryModal 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};