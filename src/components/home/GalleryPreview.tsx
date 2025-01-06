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
      try {
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

        return storageData
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map(file => {
            const { data } = supabase.storage.from('gallery').getPublicUrl(file.name);
            return data.publicUrl;
          });
      } catch (err) {
        console.error('Unexpected error fetching images:', err);
        return [];
      }
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
        
        if (error) {
          console.error('Error fetching gallery config:', error);
          return false;
        }
        
        return data?.value === 'true';
      } catch (err) {
        console.error('Unexpected error fetching config:', err);
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

  if (error) {
    return <div className="mt-16 text-center text-red-500">Error loading gallery</div>;
  }

  if (isLoading) {
    return <div className="mt-16 text-center">Loading gallery...</div>;
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
      )}

      <GalleryModal 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};