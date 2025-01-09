import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryModalContentProps {
  selectedImage: string;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  isFirstImage: boolean;
  isLastImage: boolean;
}

export function GalleryModalContent({
  selectedImage,
  onClose,
  onNavigate,
  isFirstImage,
  isLastImage,
}: GalleryModalContentProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-50 bg-white/80 hover:bg-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {!isFirstImage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-50"
          onClick={() => onNavigate('prev')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {!isLastImage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-50"
          onClick={() => onNavigate('next')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      <img
        src={selectedImage}
        alt="Selected gallery image"
        className="max-w-full max-h-[85vh] object-contain"
      />
    </div>
  );
}