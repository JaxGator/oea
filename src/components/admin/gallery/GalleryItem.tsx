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
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  return (
    <div className="relative group aspect-square">
      {/* Loading/Error state */}
      <div className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${
        isLoaded && !hasError ? 'hidden' : 'block'
      }`}>
        {hasError ? (
          <div className="text-center p-2">
            <span className="text-destructive text-sm">Failed to load image</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete()}
              className="mt-2"
            >
              Remove
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">Loading...</span>
        )}
      </div>
      
      {/* Image */}
      <img
        src={imageUrl}
        alt={`Gallery image ${imageId}`}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Delete button */}
      {!hasError && (
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