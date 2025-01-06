import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Image, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress: (imageUrl: string) => (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  images, 
  onImageSelect, 
  onKeyPress,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="status" aria-label="Loading gallery">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative aspect-square animate-pulse">
            <Skeleton className="w-full h-full rounded-lg bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg" role="status">
        <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" aria-hidden="true" />
        <p className="text-gray-600">No images available in the gallery</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      role="grid"
      aria-label="Gallery grid"
    >
      {images.slice(0, 4).map((imageUrl, index) => (
        <button
          key={index}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "transition-transform duration-300 hover:scale-[1.02]"
          )}
          onClick={() => onImageSelect(imageUrl)}
          onKeyDown={onKeyPress(imageUrl)}
          aria-label={`View gallery image ${index + 1}`}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          <img
            src={imageUrl}
            alt={`Gallery preview ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 p-2 rounded-full">
              <ZoomIn className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};