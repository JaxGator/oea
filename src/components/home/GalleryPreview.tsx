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

  return (
    <div className="mt-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Photo Gallery
        </h2>
        <Button onClick={() => setShowFullGallery(true)} variant="outline">
          View All Photos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {previewImages.map((imageUrl, index) => (
          <div 
            key={index} 
            className="aspect-square overflow-hidden rounded-lg cursor-pointer"
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

      {/* Full Gallery Modal */}
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

      {/* Selected Image Modal */}
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