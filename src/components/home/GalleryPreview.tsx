import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GallerySection } from './GallerySection';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: configs } = useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value');
      
      if (error) throw error;
      
      return data.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    }
  });

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data: galleryImages, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      return galleryImages.map(img => {
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(img.file_name);
        return publicUrl;
      });
    }
  });

  const previewImages = images.slice(0, 4);
  const carouselEnabled = configs?.gallery_carousel_enabled === 'true';
  const carouselInterval = parseInt(configs?.gallery_carousel_interval || '5000');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (carouselEnabled && previewImages.length > 0) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === previewImages.length - 1 ? 0 : prevIndex + 1
        );
      }, carouselInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [carouselEnabled, carouselInterval, previewImages.length]);

  if (isLoading || previewImages.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
        <Button onClick={() => setShowFullGallery(true)} variant="outline">
          View All Photos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {previewImages.map((imageUrl, index) => (
          <div 
            key={index} 
            className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-500 ${
              carouselEnabled ? (index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-40 scale-100') : ''
            }`}
            onClick={() => setSelectedImage(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Gallery preview ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <Dialog open={showFullGallery} onOpenChange={setShowFullGallery}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <GallerySection
            images={images}
            isLoading={isLoading}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onImageDeselect={() => setSelectedImage(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected gallery image"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};