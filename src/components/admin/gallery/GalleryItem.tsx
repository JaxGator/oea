import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GalleryItemProps {
  imageUrl: string;
  imageId: string;
  onDelete: () => void;
}

export function GalleryItem({ imageUrl, imageId, onDelete }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    console.error('Failed to load image:', imageUrl);
    setHasError(true);
    setIsLoaded(false);
    onDelete();
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  if (hasError) {
    return null;
  }

  return (
    <div className="relative group aspect-square">
      {!isLoaded && (
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={`Gallery image ${imageId}`}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {isLoaded && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}