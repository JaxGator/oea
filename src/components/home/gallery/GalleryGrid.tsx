import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {images.slice(0, 4).map((imageUrl, index) => (
        <button
          key={index}
          className="aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary group relative"
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
        </button>
      ))}
    </div>
  );
};