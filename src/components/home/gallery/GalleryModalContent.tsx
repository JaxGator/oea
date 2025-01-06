import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryModalContentProps {
  selectedImage: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstImage: boolean;
  isLastImage: boolean;
}

export const GalleryModalContent: React.FC<GalleryModalContentProps> = ({
  selectedImage,
  onClose,
  onPrevious,
  onNext,
  isFirstImage,
  isLastImage,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/50">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-50 bg-white/80 hover:bg-white"
        onClick={onClose}
        aria-label="Close image preview"
      >
        <X className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full"
        onClick={onPrevious}
        disabled={isFirstImage}
        aria-label="Previous image"
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
        onClick={onNext}
        disabled={isLastImage}
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
};