import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GalleryGridContainerProps {
  images: Array<{ url: string; id: string }>;
  onImageDelete: (imageUrl: string) => void;
}

export function GalleryGridContainer({ images, onImageDelete }: GalleryGridContainerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageId: string) => {
    console.log('Image loaded successfully:', imageId);
    setLoadedImages(prev => new Set([...prev, imageId]));
    setErrorImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('Failed to load image:', {
      id: imageId,
      url: imageUrl,
      timestamp: new Date().toISOString()
    });
    setErrorImages(prev => new Set([...prev, imageId]));
  };

  console.log('Rendering GalleryGridContainer with images:', images);

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>No images available in the gallery.</p>
        <p className="text-sm mt-2">Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group aspect-square">
          {/* Loading placeholder */}
          <div className={`w-full h-full bg-muted rounded-lg flex items-center justify-center ${
            loadedImages.has(image.id) ? 'hidden' : 'block'
          }`}>
            {errorImages.has(image.id) ? (
              <span className="text-destructive text-sm">Failed to load image</span>
            ) : (
              <span className="text-muted-foreground">Loading...</span>
            )}
          </div>
          
          {/* Actual image */}
          <img
            src={image.url}
            alt={`Gallery image`}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
              loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.id, image.url)}
          />
          
          {/* Delete button */}
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Deleting image:', image.url);
              onImageDelete(image.url);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}