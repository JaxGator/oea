import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GallerySectionProps {
  images: string[];
  isLoading: boolean;
  selectedImage: string | null;
  onImageSelect: (image: string) => void;
  onImageDeselect: () => void;
}

export const GallerySection = ({
  images,
  isLoading,
  selectedImage,
  onImageSelect,
  onImageDeselect,
}: GallerySectionProps) => {
  return (
    <div className="mt-16 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600">Loading gallery...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No images found in the gallery.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => onImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={onImageDeselect}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size gallery image"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};