import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const currentImageIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      onImageSelect(images[currentImageIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      onImageSelect(images[currentImageIndex + 1]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600">Loading gallery...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No images found in the gallery.</div>
          ) : (
            <ScrollArea className="h-[500px] w-full rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={onImageDeselect}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black/50">
            {selectedImage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full"
                  onClick={handlePrevious}
                  disabled={currentImageIndex <= 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <img
                  src={selectedImage}
                  alt="Full size gallery image"
                  className="max-w-full max-h-[85vh] object-contain"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full"
                  onClick={handleNext}
                  disabled={currentImageIndex >= images.length - 1}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};