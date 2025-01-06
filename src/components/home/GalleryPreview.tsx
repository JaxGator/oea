import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GallerySection } from './GallerySection';
import { GalleryModal } from './gallery/GalleryModal';
import { GalleryCarousel } from './gallery/GalleryCarousel';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryHeader } from './gallery/GalleryHeader';
import { toast } from 'sonner';

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      try {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('gallery')
          .list();

        if (storageError) {
          console.error('Storage error:', storageError);
          throw storageError;
        }

        if (!storageData) {
          console.log('No storage data found');
          return [];
        }

        const imageUrls = storageData
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map(file => {
            const { data } = supabase.storage.from('gallery').getPublicUrl(file.name);
            return data.publicUrl;
          });

        return imageUrls;
      } catch (err) {
        console.error('Failed to fetch gallery images:', err);
        toast.error('Failed to load gallery images');
        return [];
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });

  const { data: config } = useQuery({
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
      } catch (err) {
        console.error('Failed to fetch gallery config:', err);
        return false;
      }
    },
    refetchOnWindowFocus: false
  });

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  if (error) {
    console.error('Gallery error:', error);
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load gallery. Please try again later.
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-4">
      <GalleryHeader onViewAllClick={() => setShowFullGallery(true)} />
      
      {config ? (
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

      {/* Full Gallery Modal */}
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

      {/* Selected Image Modal */}
      <GalleryModal 
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};