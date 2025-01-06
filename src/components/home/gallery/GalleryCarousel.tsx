import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";

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
          <div key={index} className="relative aspect-square">
            <Skeleton className="w-full h-full rounded-lg animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No images available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <button
              className="w-full aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group relative"
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
                  <Image className="w-6 h-6 text-white" />
                </div>
              </div>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};