import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryCarouselProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress: (imageUrl: string) => (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ 
  images, 
  onImageSelect, 
  onKeyPress,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <button
              className="w-full aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary group relative"
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};