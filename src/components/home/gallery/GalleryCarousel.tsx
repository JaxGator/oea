import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryCarouselProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
  onKeyPress: (imageUrl: string) => (e: React.KeyboardEvent) => void;
}

export const GalleryCarousel = ({ images, onImageSelect, onKeyPress }: GalleryCarouselProps) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <button
              className="w-full aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => onImageSelect(imageUrl)}
              onKeyDown={onKeyPress(imageUrl)}
              aria-label={`View gallery image ${index + 1}`}
            >
              <img
                src={imageUrl}
                alt={`Gallery preview ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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