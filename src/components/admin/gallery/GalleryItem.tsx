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

  return (
    <div className="relative group aspect-square">
      {/* Loading/Error state */}
      <div className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${
        isLoaded && !hasError ? 'hidden' : 'block'
      }`}>
        {hasError ? (
          <span className="text-destructive text-sm">Failed to load image</span>
        ) : (
          <span className="text-muted-foreground">Loading...</span>
        )}
      </div>
      
      {/* Image */}
      <img
        src={imageUrl}
        alt="Gallery image"
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {/* Delete button */}
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}