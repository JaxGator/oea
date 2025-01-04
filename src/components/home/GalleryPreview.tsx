import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GallerySection } from './GallerySection';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from "lucide-react";

export const GalleryPreview = () => {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data: storageData, error } = await supabase.storage
        .from('gallery')
        .list();

      if (error) throw error;

      const imageUrls = storageData
        .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
        .map(file => supabase.storage.from('gallery').getPublicUrl(file.name).data.publicUrl);

      return imageUrls;
    }
  });

  const previewImages = images.slice(0, 4);

  const handleKeyPress = (imageUrl: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="mt-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="h-6 w-6" role="presentation" />
          Photo Gallery
        </h2>
        <Button onClick={() => setShowFullGallery(true)} variant="outline">
          View All Photos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {previewImages.map((imageUrl, index) => (
          <button
            key={index}
            className="aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setSelectedImage(imageUrl)}
            onKeyDown={handleKeyPress(imageUrl)}
            aria-label={`View gallery image ${index + 1}`}
          >
            <img
              src={imageUrl}
              alt={`Gallery preview ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* Full Gallery Modal */}
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

      {/* Selected Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-[#8E9196]">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected gallery image"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                style={{ margin: 'auto' }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};