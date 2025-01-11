import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GalleryItemProps {
  imageUrl: string;
  imageId: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function GalleryItem({ imageUrl, imageId, onDelete, isDeleting = false }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

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
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.error('Failed to load image:', imageUrl);
          e.currentTarget.src = '/placeholder.svg';
          setIsLoaded(true);
        }}
      />
      
      {isLoaded && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}